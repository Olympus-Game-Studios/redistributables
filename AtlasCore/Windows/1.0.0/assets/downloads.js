// Downloads page functionality
// Fetches available downloads from GitHub Redistributables repository

// Configuration
const GITHUB_ORG = 'Olympus-Game-Studios';
const GITHUB_REPO = 'redistributables';

// Use raw GitHub URL for public repos (simpler, no API rate limits)
const MANIFEST_URL = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/main/manifest.json`;

// Self-update configuration
const ATLASCORE_PRODUCT_NAME = 'AtlasCore';

// State
let availableDownloads = [];
let installedItems = {};
let downloadProgress = {};
let installBasePath = '';
let appInfo = null; // Current app info (version, path, pid)
let selfUpdateAvailable = null; // Info about available AtlasCore update

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

async function init() {
    loadInstalledItems();
    
    // Wait for native functions to be available (injected by C++)
    await waitForNativeFunctions();
    
    // Get current app info for self-update detection
    await loadAppInfo();
    
    await determineInstallPath();
    await fetchManifest();
    setupEventListeners();
}

// Load current app info
async function loadAppInfo() {
    if (typeof nativeGetAppInfo === 'function') {
        try {
            appInfo = await nativeGetAppInfo();
            console.log('App info:', appInfo);
        } catch (e) {
            console.error('Failed to get app info:', e);
        }
    }
}

// Wait for native functions to be injected
function waitForNativeFunctions() {
    return new Promise((resolve) => {
        const check = () => {
            if (typeof nativeFetchUrlWithAuth === 'function' || typeof nativeFetchUrl === 'function') {
                resolve();
            } else {
                setTimeout(check, 50);
            }
        };
        // Give it a moment then start checking
        setTimeout(check, 100);
    });
}

function setupEventListeners() {
    document.getElementById('check-updates').addEventListener('click', refreshDownloads);
}

// Determine where to install downloads
async function determineInstallPath() {
    // Try to get path from settings in localStorage
    try {
        const settingsJson = localStorage.getItem('atlas_settings');
        if (settingsJson) {
            const settings = JSON.parse(settingsJson);
            // The Settings UI currently edits installLocation.
            // Prefer it so the default location actually takes effect.
            const settingsPath = settings.installLocation || settings.downloadLocation;
            if (settingsPath) {
                console.log('Using settings path:', settingsPath);
                installBasePath = settingsPath;
                return;
            }
        }
    } catch (e) {
        console.log('Could not load settings:', e);
    }
    
    // Check for saved install path (legacy)
    const savedPath = localStorage.getItem('atlas_install_path');
    if (savedPath && await pathExists(savedPath)) {
        installBasePath = savedPath;
        return;
    }
    
    // Default to user's Documents/OlympusGames folder
    if (typeof nativeGetUserFolder === 'function') {
        const userFolder = await nativeGetUserFolder();
        installBasePath = userFolder + '\\OlympusGames';
    } else {
        // Fallback - will prompt user to select
        installBasePath = '';
    }
}

// Load installed items from localStorage
function loadInstalledItems() {
    try {
        const stored = localStorage.getItem('atlas_installed_items');
        if (stored) {
            installedItems = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load installed items:', e);
        installedItems = {};
    }
}

// Save installed items to localStorage
function saveInstalledItems() {
    try {
        localStorage.setItem('atlas_installed_items', JSON.stringify(installedItems));
    } catch (e) {
        console.error('Failed to save installed items:', e);
    }
}

// Check if a path exists
async function pathExists(path) {
    if (typeof nativePathExists === 'function') {
        return nativePathExists(path);
    }
    return false;
}

// List directory entries using native bridge.
// Returns: Array<{ name: string, isDirectory: boolean }>
async function listDirectory(path) {
    if (typeof nativeListDirectory !== 'function') return [];
    try {
        const json = await nativeListDirectory(path);
        const parsed = JSON.parse(json || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn('Failed to list directory:', path, e);
        return [];
    }
}

// Resolve the actual install directory that contains the entry executable.
// Some archives include a single top-level folder (often the version), resulting in installPath\<folder>\entry.
async function resolveInstallPathForEntry(installPath, entryRelPath) {
    if (!installPath || !entryRelPath) return installPath;

    let current = installPath;
    for (let depth = 0; depth < 3; depth++) {
        const candidateExe = current + '\\' + entryRelPath;
        if (await pathExists(candidateExe)) return current;

        const entries = await listDirectory(current);
        const dirs = entries.filter(e => e && e.isDirectory);
        const files = entries.filter(e => e && !e.isDirectory);

        // Only descend when it's a clean single-folder wrapper.
        if (dirs.length === 1 && files.length === 0) {
            current = current + '\\' + dirs[0].name;
            continue;
        }

        break;
    }

    return installPath;
}

// Fetch the manifest from GitHub
async function fetchManifest() {
    showLoading('Fetching available downloads...');
    
    try {
        let manifestData;
        let response;
        
        console.log('Fetching manifest from:', MANIFEST_URL);
        
        if (typeof nativeFetchUrl === 'function') {
            response = await nativeFetchUrl(MANIFEST_URL);
        }
        
        console.log('Raw response:', response);
        
        if (response) {
            const parsed = JSON.parse(response);
            console.log('Parsed response:', parsed);
            
            if (parsed.message) {
                // GitHub error
                console.error('GitHub error:', parsed.message);
                showError('GitHub error: ' + parsed.message);
                return;
            }
            
            if (parsed.products) {
                // Direct manifest data
                manifestData = parsed;
            }
        }
        
        if (manifestData && manifestData.products) {
            processManifest(manifestData);
        } else {
            showError('Failed to load manifest or manifest is empty');
        }
    } catch (e) {
        console.error('Error fetching manifest:', e);
        showError('Failed to fetch downloads manifest: ' + e.message);
    }
}

// Process the manifest data
function processManifest(manifest) {
    availableDownloads = [];
    selfUpdateAvailable = null;
    
    for (const product of manifest.products) {
        for (const version of product.versions) {
            availableDownloads.push({
                name: product.name,
                displayName: product.displayName || product.name,
                description: product.description || '',
                version: version.version,
                platform: version.platform || 'windows-x64',
                entry: version.entry,
                downloadUrl: version.downloadUrl,
                size: version.size || 0,
                checksum: version.checksum || '',
                build_date: version.build_date || '',
                tags: version.tags || product.tags || [],
                installed: isInstalled(product.name, version.version)
            });
            
            // Check for AtlasCore self-update
            if (product.name === ATLASCORE_PRODUCT_NAME && appInfo && appInfo.version) {
                if (compareVersions(version.version, appInfo.version) > 0) {
                    // Newer version available
                    if (!selfUpdateAvailable || compareVersions(version.version, selfUpdateAvailable.version) > 0) {
                        selfUpdateAvailable = {
                            version: version.version,
                            downloadUrl: version.downloadUrl,
                            build_date: version.build_date,
                            currentVersion: appInfo.version
                        };
                    }
                }
            }
        }
    }
    
    // Sort by product name, then by version (descending)
    availableDownloads.sort((a, b) => {
        if (a.name !== b.name) return a.name.localeCompare(b.name);
        return compareVersions(b.version, a.version);
    });
    
    renderDownloads();
}

// Check if a product version is installed
function isInstalled(productName, version) {
    const key = `${productName}@${version}`;
    return installedItems[key]?.installed === true;
}

// Mark a product version as installed
function markInstalled(productName, version, installPath) {
    const key = `${productName}@${version}`;
    installedItems[key] = {
        installed: true,
        installPath: installPath,
        installDate: new Date().toISOString()
    };
    saveInstalledItems();
}

// Compare semantic versions
function compareVersions(a, b) {
    const normalize = (v) => {
        // Extract just the version numbers, handling formats like "0.0.9-nightly-20251224"
        const match = v.match(/^(\d+)\.(\d+)\.(\d+)/);
        if (match) {
            return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        }
        return [0, 0, 0];
    };
    
    const aParts = normalize(a);
    const bParts = normalize(b);
    
    for (let i = 0; i < 3; i++) {
        if (aParts[i] !== bParts[i]) {
            return aParts[i] - bParts[i];
        }
    }
    
    // If base versions are equal, compare full strings (for pre-release tags)
    return a.localeCompare(b);
}

// Render the downloads grid
function renderDownloads() {
    const grid = document.getElementById('downloads-grid');
    if (!grid) return;
    
    // Render self-update banner if available
    renderSelfUpdateBanner();
    
    if (availableDownloads.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <h3>No Downloads Available</h3>
                <p>No redistributables found in the repository.</p>
                <button class="btn-secondary" onclick="showSetupUI()">Configure Repository</button>
            </div>
        `;
        return;
    }
    
    // Group by product name and show only latest version prominently
    const latestByProduct = {};
    const allVersionsByProduct = {};
    
    for (const item of availableDownloads) {
        if (!latestByProduct[item.name] || 
            compareVersions(item.version, latestByProduct[item.name].version) > 0) {
            latestByProduct[item.name] = item;
        }
        
        if (!allVersionsByProduct[item.name]) {
            allVersionsByProduct[item.name] = [];
        }
        allVersionsByProduct[item.name].push(item);
    }
    
    let html = '';
    
    for (const [productName, latest] of Object.entries(latestByProduct)) {
        const allVersions = allVersionsByProduct[productName];
        const hasMultipleVersions = allVersions.length > 1;
        const icon = getProductIcon(productName);
        const iconClass = getProductIconClass(productName);
        const status = getInstallStatus(latest);
        
        html += `
            <div class="download-card" data-product="${escapeHtml(productName)}" data-version="${escapeHtml(latest.version)}">
                <div class="card-header">
                    <div class="card-icon ${iconClass}">
                        ${icon}
                    </div>
                    <div class="card-info">
                        <h3>${escapeHtml(productName)}</h3>
                        <span class="version">v${escapeHtml(latest.version)}</span>
                    </div>
                    <span class="status-badge ${status.class}">${status.text}</span>
                </div>
                <p class="card-description">${getProductDescription(productName, latest)}</p>
                ${latest.build_date ? `<p class="card-meta">Built: ${formatDate(latest.build_date)}</p>` : ''}
                ${renderTags(latest.tags)}
                <div class="card-actions">
                    ${renderActions(latest, hasMultipleVersions)}
                </div>
                ${hasMultipleVersions ? renderVersionDropdown(productName, allVersions) : ''}
            </div>
        `;
    }
    
    grid.innerHTML = html;
    
    // Attach event listeners
    attachCardEventListeners();
}

// Get status for installation
function getInstallStatus(item) {
    if (item.installed) {
        return { text: 'Installed', class: 'ok' };
    }
    
    // Check if we have an older version installed
    const installedVersion = getInstalledVersion(item.name);
    if (installedVersion) {
        const cmp = compareVersions(item.version, installedVersion);
        if (cmp > 0) {
            return { text: 'Update Available', class: 'warning' };
        }
        return { text: 'Installed', class: 'ok' };
    }
    
    return { text: 'Not Installed', class: '' };
}

// Get the installed version of a product
function getInstalledVersion(productName) {
    for (const [key, value] of Object.entries(installedItems)) {
        if (key.startsWith(productName + '@') && value.installed) {
            return key.split('@')[1];
        }
    }
    return null;
}

// Get product icon SVG
function getProductIcon(productName) {
    const name = productName.toLowerCase();
    
    if (name.includes('engine') || name.includes('hephaestus')) {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
            <line x1="12" y1="22" x2="12" y2="15.5"/>
            <polyline points="22,8.5 12,15.5 2,8.5"/>
        </svg>`;
    }
    
    if (name.includes('editor')) {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>`;
    }
    
    if (name.includes('tool') || name.includes('build')) {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>`;
    }
    
    if (name.includes('game') || name.includes('devil')) {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <line x1="6" y1="12" x2="10" y2="12"/>
            <line x1="8" y1="10" x2="8" y2="14"/>
            <circle cx="16" cy="10" r="1"/>
            <circle cx="18" cy="12" r="1"/>
        </svg>`;
    }
    
    // Default download icon
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>`;
}

// Get product icon CSS class
function getProductIconClass(productName) {
    const name = productName.toLowerCase();
    
    if (name.includes('engine') || name.includes('hephaestus')) return 'engine';
    if (name.includes('editor')) return 'editor';
    if (name.includes('tool') || name.includes('build')) return 'tools';
    if (name.includes('game') || name.includes('devil')) return 'game';
    
    return 'pipeline';
}

// Get product description
function getProductDescription(productName, metadata) {
    if (metadata.description) return metadata.description;
    
    const name = productName.toLowerCase();
    
    if (name.includes('hephaestus') && name.includes('engine')) {
        return 'The Hephaestus game engine - a powerful tool for creating immersive gaming experiences.';
    }
    if (name.includes('engine')) {
        return 'Game engine runtime and development tools.';
    }
    if (name.includes('editor')) {
        return 'Visual editor for creating and editing game content.';
    }
    if (name.includes('devil')) {
        return 'The Devil You Know - a story-driven adventure game.';
    }
    
    return `${productName} redistributable package.`;
}

// Render tags
function renderTags(tags) {
    if (!tags || tags.length === 0) return '';
    
    const tagHtml = tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
    return `<div class="card-tags">${tagHtml}</div>`;
}

// Render action buttons
function renderActions(item, hasMultipleVersions) {
    const isInstalled = item.installed || getInstalledVersion(item.name);
    let html = '';
    
    if (isInstalled) {
        html += `<button class="btn-secondary" onclick="verifyInstall('${escapeAttr(item.name)}', '${escapeAttr(item.version)}')">Verify</button>`;
        html += `<button class="btn-secondary" onclick="removeItem('${escapeAttr(item.name)}', '${escapeAttr(item.version)}')">Remove</button>`;
        
        const installedVer = getInstalledVersion(item.name);
        if (installedVer && compareVersions(item.version, installedVer) > 0) {
            html += `<button class="btn-primary" onclick="updateItem('${escapeAttr(item.name)}', '${escapeAttr(item.version)}')">Update to v${escapeHtml(item.version)}</button>`;
        } else if (item.entry) {
            html += `<button class="btn-primary" onclick="launchItem('${escapeAttr(item.name)}', '${escapeAttr(item.version)}')">Launch</button>`;
        }
    } else {
        html += `<button class="btn-primary" onclick="installItem('${escapeAttr(item.name)}', '${escapeAttr(item.version)}')">Install</button>`;
    }
    
    if (hasMultipleVersions) {
        html += `<button class="btn-secondary version-toggle" onclick="toggleVersions('${escapeAttr(item.name)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <polyline points="6,9 12,15 18,9"/>
            </svg>
        </button>`;
    }
    
    return html;
}

// Render version dropdown
function renderVersionDropdown(productName, versions) {
    let html = `<div class="version-dropdown" id="versions-${escapeAttr(productName)}" style="display: none;">
        <div class="version-list">`;
    
    for (const v of versions) {
        const status = v.installed ? 'installed' : '';
        html += `
            <div class="version-item ${status}" onclick="selectVersion('${escapeAttr(productName)}', '${escapeAttr(v.version)}')">
                <span class="version-number">v${escapeHtml(v.version)}</span>
                ${v.build_date ? `<span class="version-date">${formatDate(v.build_date)}</span>` : ''}
                ${v.installed ? '<span class="version-status">Installed</span>' : ''}
            </div>
        `;
    }
    
    html += '</div></div>';
    return html;
}

// Toggle version dropdown
function toggleVersions(productName) {
    const dropdown = document.getElementById('versions-' + productName);
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Select a specific version
function selectVersion(productName, version) {
    const item = availableDownloads.find(d => d.name === productName && d.version === version);
    if (item) {
        // Update the card to show this version
        const card = document.querySelector(`[data-product="${productName}"]`);
        if (card) {
            card.dataset.version = version;
            card.querySelector('.version').textContent = 'v' + version;
            
            const status = getInstallStatus(item);
            const badge = card.querySelector('.status-badge');
            badge.textContent = status.text;
            badge.className = 'status-badge ' + status.class;
            
            const actions = card.querySelector('.card-actions');
            const hasMultipleVersions = availableDownloads.filter(d => d.name === productName).length > 1;
            actions.innerHTML = renderActions(item, hasMultipleVersions);
        }
    }
    toggleVersions(productName);
}

// Install an item (download from GitHub)
async function installItem(productName, version) {
    const item = availableDownloads.find(d => d.name === productName && d.version === version);
    if (!item) {
        showToast('Item not found', 'error');
        return;
    }
    
    if (!item.downloadUrl) {
        showToast('No download URL available for this item', 'error');
        return;
    }
    
    // Determine install path
    let targetPath = installBasePath;
    if (!targetPath) {
        if (typeof nativeBrowseFolder === 'function') {
            targetPath = await nativeBrowseFolder();
            if (!targetPath) {
                showToast('Installation cancelled', 'warning');
                return;
            }
            installBasePath = targetPath;
            localStorage.setItem('atlas_install_path', targetPath);
        } else {
            showToast('Please configure an install location in settings', 'error');
            return;
        }
    }
    
    const installPath = targetPath + '\\' + productName + '\\' + version;
    
    // Show progress UI
    showDownloadProgress(productName, version, 0);
    
    try {
        showToast(`Downloading ${productName} v${version}...`, 'info');
        
        // Download the file
        if (typeof nativeDownloadAndExtract === 'function') {
            const result = await nativeDownloadAndExtract(
                item.downloadUrl,
                installPath
            );
            
            if (result) {
                // Verify that files were actually extracted before marking as installed
                const pathOk = await pathExists(installPath);
                if (!pathOk) {
                    hideDownloadProgress(productName);
                    showToast(`Installation failed: Files not found after extraction`, 'error');
                    return;
                }

                // If an entry is defined, resolve the actual folder containing it (handles version\\version nesting)
                let finalInstallPath = installPath;
                if (item && item.entry) {
                    finalInstallPath = await resolveInstallPathForEntry(installPath, item.entry);
                    const exeOk = await pathExists(finalInstallPath + '\\' + item.entry);
                    if (!exeOk) {
                        hideDownloadProgress(productName);
                        showToast(`Installation failed: ${item.entry} not found after extraction`, 'error');
                        return;
                    }
                }

                // Mark as installed
                item.installed = true;
                item.installPath = finalInstallPath;
                markInstalled(productName, version, finalInstallPath);

                hideDownloadProgress(productName);
                renderDownloads();
                showToast(`${productName} v${version} installed successfully!`, 'success');
            } else {
                hideDownloadProgress(productName);
                showToast(`Failed to install ${productName}`, 'error');
            }
        } else {
            // Fallback: Open download URL in browser
            hideDownloadProgress(productName);
            if (typeof nativeOpenUrl === 'function') {
                nativeOpenUrl(item.downloadUrl);
                showToast('Download started in browser. Please extract manually.', 'info');
            } else {
                showToast('Download functionality not available', 'error');
            }
        }
    } catch (e) {
        console.error('Install error:', e);
        hideDownloadProgress(productName);
        showToast(`Installation failed: ${e.message}`, 'error');
    }
}

// Show download progress
function showDownloadProgress(productName, version, progress) {
    const card = document.querySelector(`[data-product="${productName}"]`);
    if (!card) return;
    
    let progressEl = card.querySelector('.download-progress');
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.className = 'download-progress';
        progressEl.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">
                <span class="progress-status">Downloading...</span>
                <span class="progress-percent">0%</span>
            </div>
        `;
        card.querySelector('.card-actions').before(progressEl);
    }
    
    progressEl.querySelector('.progress-fill').style.width = progress + '%';
    progressEl.querySelector('.progress-percent').textContent = Math.round(progress) + '%';
    
    if (progress >= 100) {
        progressEl.querySelector('.progress-status').textContent = 'Extracting...';
    }
}

// Hide download progress
function hideDownloadProgress(productName) {
    const card = document.querySelector(`[data-product="${productName}"]`);
    if (!card) return;
    
    const progressEl = card.querySelector('.download-progress');
    if (progressEl) {
        progressEl.remove();
    }
}

// Update an item
async function updateItem(productName, version) {
    await installItem(productName, version);
}

// Verify installation
async function verifyInstall(productName, version) {
    const key = `${productName}@${version}`;
    const installed = installedItems[key];
    
    if (!installed || !installed.installPath) {
        showToast('Installation record not found', 'error');
        return;
    }
    
    const item = availableDownloads.find(d => d.name === productName && d.version === version);
    
    showToast(`Verifying ${productName}...`, 'info');
    
    // Check if the install path exists
    const pathOk = await pathExists(installed.installPath);
    if (!pathOk) {
        showToast(`Installation folder not found. Please reinstall.`, 'error');
        return;
    }
    
    // Check if the entry executable exists
    if (item && item.entry) {
        const resolvedPath = await resolveInstallPathForEntry(installed.installPath, item.entry);
        const exePath = resolvedPath + '\\' + item.entry;
        const exists = await pathExists(exePath);

        if (exists) {
            if (resolvedPath !== installed.installPath) {
                installed.installPath = resolvedPath;
                installedItems[key] = installed;
                saveInstalledItems();
            }
            showToast(`${productName} verified successfully!`, 'success');
        } else {
            showToast(`Verification failed: ${item.entry} not found. Install may be corrupted.`, 'error');
        }
    } else {
        showToast(`${productName} folder verified`, 'success');
    }
}

// Remove a product installation
async function removeItem(productName, version) {
    console.log('removeItem called:', productName, version);
    const key = `${productName}@${version}`;
    const installed = installedItems[key];
    
    if (!installed) {
        showToast('Installation record not found', 'error');
        return;
    }
    
    // Remove from installed items (skip confirmation for now as it may not work in Ultralight)
    delete installedItems[key];
    saveInstalledItems();
    
    // Update the in-memory state for any matching downloads
    const item = availableDownloads.find(d => d.name === productName && d.version === version);
    if (item) {
        item.installed = false;
        item.installPath = null;
    }
    
    // Update UI
    renderDownloads();
    showToast(`${productName} v${version} removed. You can now reinstall it.`, 'success');
}

// Expose functions globally for onclick handlers
window.installItem = installItem;
window.verifyInstall = verifyInstall;
window.removeItem = removeItem;
window.launchItem = launchItem;
window.updateItem = updateItem;
window.toggleVersions = toggleVersions;
window.selectVersion = selectVersion;
window.startSelfUpdate = startSelfUpdate;
window.dismissUpdateBanner = dismissUpdateBanner;

// Render self-update banner if a new version of AtlasCore is available
function renderSelfUpdateBanner() {
    // Remove existing banner
    const existing = document.getElementById('self-update-banner');
    if (existing) existing.remove();
    
    if (!selfUpdateAvailable) return;
    
    const banner = document.createElement('div');
    banner.id = 'self-update-banner';
    banner.className = 'update-banner';
    banner.innerHTML = `
        <div class="update-banner-content">
            <div class="update-banner-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </div>
            <div class="update-banner-text">
                <strong>AtlasCore Update Available</strong>
                <span>Version ${escapeHtml(selfUpdateAvailable.version)} is available (you have v${escapeHtml(selfUpdateAvailable.currentVersion)})</span>
            </div>
            <div class="update-banner-actions">
                <button class="btn-primary" onclick="startSelfUpdate()">Update Now</button>
                <button class="btn-secondary" onclick="dismissUpdateBanner()">Later</button>
            </div>
        </div>
    `;
    
    // Insert at the top of the downloads container
    const container = document.querySelector('.downloads-container') || document.querySelector('.content-wrapper') || document.body;
    container.insertBefore(banner, container.firstChild);
}

// Dismiss the update banner for this session
function dismissUpdateBanner() {
    const banner = document.getElementById('self-update-banner');
    if (banner) {
        banner.classList.add('dismissed');
        setTimeout(() => banner.remove(), 300);
    }
}

// Start the self-update process
async function startSelfUpdate() {
    if (!selfUpdateAvailable || !selfUpdateAvailable.downloadUrl) {
        showToast('No update information available', 'error');
        return;
    }
    
    if (typeof nativeLaunchUpdater !== 'function') {
        showToast('Update functionality not available', 'error');
        return;
    }
    
    // Show updating state on the banner
    const banner = document.getElementById('self-update-banner');
    if (banner) {
        banner.querySelector('.update-banner-actions').innerHTML = `
            <span class="updating-text">
                <svg class="spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="23,4 23,10 17,10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Downloading update...
            </span>
        `;
    }
    
    try {
        // Get temp directory for update
        let tempPath;
        if (typeof nativeGetTempPath === 'function') {
            tempPath = await nativeGetTempPath();
        } else {
            // Fallback - try to get from app info
            tempPath = 'C:\\Temp';
        }
        
        const updatePath = tempPath + '\\AtlasCoreUpdate';
        
        console.log('Downloading update to:', updatePath);
        showToast('Downloading AtlasCore update...', 'info');
        
        // Download and extract update
        if (typeof nativeDownloadAndExtract === 'function') {
            const result = await nativeDownloadAndExtract(
                selfUpdateAvailable.downloadUrl,
                updatePath
            );
            
            if (!result) {
                showToast('Failed to download update', 'error');
                renderSelfUpdateBanner(); // Reset banner
                return;
            }
            
            // Resolve nested folder if present (same as regular installs)
            let finalUpdatePath = updatePath;
            if (appInfo && appInfo.exePath) {
                const exeName = appInfo.exePath.split('\\').pop();
                finalUpdatePath = await resolveInstallPathForEntry(updatePath, exeName);
            }
            
            console.log('Update downloaded, launching updater with path:', finalUpdatePath);
            
            if (banner) {
                banner.querySelector('.update-banner-actions').innerHTML = `
                    <span class="updating-text">Applying update, please wait...</span>
                `;
            }
            
            showToast('Applying update, AtlasCore will restart...', 'info');
            
            // Small delay to let the toast appear
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Launch updater (this will exit the app)
            const launched = await nativeLaunchUpdater(finalUpdatePath);
            
            if (!launched) {
                showToast('Failed to launch updater', 'error');
                renderSelfUpdateBanner(); // Reset banner
            }
            // If successful, app will exit - no need to do anything else
        } else {
            showToast('Download functionality not available', 'error');
            renderSelfUpdateBanner();
        }
    } catch (e) {
        console.error('Self-update error:', e);
        showToast('Update failed: ' + e.message, 'error');
        renderSelfUpdateBanner();
    }
}

// Launch an item
async function launchItem(productName, version) {
    const key = `${productName}@${version}`;
    const installed = installedItems[key];
    
    if (!installed || !installed.installPath) {
        showToast('Installation record not found. Please reinstall.', 'error');
        return;
    }
    
    const item = availableDownloads.find(d => d.name === productName && d.version === version);
    
    if (!item || !item.entry) {
        showToast(`No entry point defined for ${productName}`, 'error');
        return;
    }
    
    const resolvedPath = await resolveInstallPathForEntry(installed.installPath, item.entry);
    const exePath = resolvedPath + '\\' + item.entry;
    
    showToast(`Launching ${productName}...`, 'info');
    
    if (typeof nativeLaunchExecutable === 'function') {
        if (resolvedPath !== installed.installPath) {
            installed.installPath = resolvedPath;
            installedItems[key] = installed;
            saveInstalledItems();
        }
        const result = await nativeLaunchExecutable(exePath, resolvedPath);
        if (result) {
            showToast(`${productName} launched!`, 'success');
        } else {
            showToast(`Failed to launch ${productName}`, 'error');
        }
    } else {
        showToast('Launch functionality not available', 'error');
    }
}

// Refresh downloads
async function refreshDownloads() {
    const btn = document.getElementById('check-updates');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Checking...
        `;
    }
    
    await fetchManifest();
    
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Check for Updates
        `;
    }
}

// Attach event listeners to cards
function attachCardEventListeners() {
    // Any additional event listeners can be attached here
}

// Show loading state
function showLoading(message) {
    const grid = document.getElementById('downloads-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-state">
                <svg class="spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23,4 23,10 17,10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }
}

// Show error state
function showError(message) {
    const grid = document.getElementById('downloads-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Error</h3>
                <p>${escapeHtml(message)}</p>
                <button class="btn-secondary" onclick="refreshDownloads()">Retry</button>
            </div>
        `;
    }
}

// Show setup UI when repo not found
function showSetupUI() {
    const grid = document.getElementById('downloads-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="setup-card">
                <div class="setup-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </div>
                <h2>Connection Error</h2>
                <p>Unable to fetch downloads from the server. Please check your internet connection and try again.</p>
                <div class="setup-actions">
                    <button class="btn-primary" onclick="refreshDownloads()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="23,4 23,10 17,10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        Retry
                    </button>
                </div>
            </div>
        `;
    }
}

// Browse for install folder
async function browseForInstallFolder() {
    if (typeof nativeBrowseFolder === 'function') {
        const path = await nativeBrowseFolder();
        if (path) {
            installBasePath = path;
            localStorage.setItem('atlas_install_path', path);
            showToast('Install location set!', 'success');
        }
    } else {
        showToast('Browse functionality not available', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (e) {
        return dateString;
    }
}

// Format file size
function formatSize(bytes) {
    if (!bytes || bytes === 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return bytes.toFixed(1) + ' ' + units[i];
}

// Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Escape attribute
function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
