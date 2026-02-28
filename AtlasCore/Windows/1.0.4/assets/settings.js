// Settings page functionality
// Handles application settings like download location, clone location, etc.

// Configuration
const SETTINGS_STORAGE_KEY = 'atlas_settings';

// Default settings
const DEFAULT_SETTINGS = {
    installLocation: 'C:\\Olympus',
    cloneLocation: 'C:\\Repos\\OlympusGames',
    gitExecutable: 'C:\\Program Files\\Git\\bin\\git.exe',
    autoUpdate: true,
    startWithWindows: false
};

// Current settings
let currentSettings = { ...DEFAULT_SETTINGS };

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Wait for native functions to be available
    await waitForNativeFunctions();
    
    // Load settings from storage or defaults
    loadSettings();
    
    // Update UI with current settings
    updateUI();

    // Update About section (version from app_info.cmake via nativeGetAppInfo)
    updateAboutInfo();
    
    // Setup event listeners
    setupEventListeners();
}

async function updateAboutInfo() {
    const versionEl = document.getElementById('about-version-value');
    if (!versionEl) return;

    if (typeof nativeGetAppInfo !== 'function') return;

    try {
        const info = await nativeGetAppInfo();
        if (info && info.version) {
            versionEl.textContent = String(info.version);
        }
    } catch (e) {
        console.log('Could not load app info for About section:', e);
    }
}

// Wait for native functions to be injected
function waitForNativeFunctions() {
    return new Promise((resolve) => {
        const check = () => {
            if (typeof nativeBrowseFolder === 'function' && 
                typeof nativeSaveSettings === 'function' &&
                typeof nativeLoadSettings === 'function') {
                resolve();
            } else {
                setTimeout(check, 50);
            }
        };
        setTimeout(check, 100);
    });
}

// Load settings from storage (localStorage or native)
function loadSettings() {
    try {
        // Try to load from localStorage first
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            currentSettings = { ...DEFAULT_SETTINGS, ...parsed };
            return;
        }
    } catch (e) {
        console.log('Could not load settings from localStorage:', e);
    }
    
    // Try to load from native storage if available
    try {
        if (typeof nativeLoadSettings === 'function') {
            const result = nativeLoadSettings();
            if (result) {
                const parsed = JSON.parse(result);
                currentSettings = { ...DEFAULT_SETTINGS, ...parsed };
                return;
            }
        }
    } catch (e) {
        console.log('Could not load settings from native storage:', e);
    }
    
    // Use defaults
    currentSettings = { ...DEFAULT_SETTINGS };
}

// Save settings to storage
function saveSettings() {
    try {
        // Save to localStorage
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(currentSettings));
        
        // Also try to save to native storage if available
        if (typeof nativeSaveSettings === 'function') {
            nativeSaveSettings(JSON.stringify(currentSettings));
        }
        
        console.log('Settings saved successfully');
        showToast('Settings saved!', 'success');
    } catch (e) {
        console.error('Error saving settings:', e);
        showToast('Error saving settings', 'error');
    }
}

// Update UI with current settings
function updateUI() {
    // General section
    const installInput = document.querySelector('[data-setting="installLocation"]');
    if (installInput) {
        installInput.value = currentSettings.installLocation;
    }
    
    const autoUpdateCheckbox = document.querySelector('[data-setting="autoUpdate"]');
    if (autoUpdateCheckbox) {
        autoUpdateCheckbox.checked = currentSettings.autoUpdate;
    }
    
    const startWithWindowsCheckbox = document.querySelector('[data-setting="startWithWindows"]');
    if (startWithWindowsCheckbox) {
        startWithWindowsCheckbox.checked = currentSettings.startWithWindows;
    }
    
    // Source Control section
    const cloneInput = document.querySelector('[data-setting="cloneLocation"]');
    if (cloneInput) {
        cloneInput.value = currentSettings.cloneLocation;
    }
    
    const gitInput = document.querySelector('[data-setting="gitExecutable"]');
    if (gitInput) {
        gitInput.value = currentSettings.gitExecutable;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Install Location Browse button
    document.querySelectorAll('.setting-item').forEach(item => {
        const label = item.querySelector('label');
        const button = item.querySelector('.btn-secondary');
        const input = item.querySelector('.setting-input');
        
        if (!button) return;
        
        // Determine which setting this is for
        let settingKey = null;
        if (input && input.dataset.setting) {
            settingKey = input.dataset.setting;
        } else if (label && label.textContent === 'Install Location') {
            settingKey = 'installLocation';
        } else if (label && label.textContent === 'Default Clone Location') {
            settingKey = 'cloneLocation';
        } else if (label && label.textContent === 'Git Executable') {
            settingKey = 'gitExecutable';
        }
        
        if (settingKey) {
            button.addEventListener('click', async () => {
                await browseFolderForSetting(settingKey, input);
            });
        }
    });
    
    // Checkboxes
    document.querySelectorAll('.setting-control input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const item = e.target.closest('.setting-item');
            const label = item.querySelector('label');
            
            if (label.textContent === 'Auto-update applications') {
                currentSettings.autoUpdate = e.target.checked;
                saveSettings();
            } else if (label.textContent === 'Start with Windows') {
                currentSettings.startWithWindows = e.target.checked;
                saveSettings();
            }
        });
    });
}

// Browse for a folder setting
async function browseFolderForSetting(settingKey, inputElement) {
    if (typeof nativeBrowseFolder !== 'function') {
        showToast('Browse functionality not available', 'error');
        return;
    }
    
    try {
        const selectedPath = await nativeBrowseFolder();
        
        if (selectedPath) {
            currentSettings[settingKey] = selectedPath;
            if (inputElement) {
                inputElement.value = selectedPath;
            }
            saveSettings();
            showToast(`${settingKey.replace(/([A-Z])/g, ' $1')} updated!`, 'success');
        }
    } catch (error) {
        console.error('Error browsing folder:', error);
        showToast('Error selecting folder', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add basic styling if not already in CSS
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease-in-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Expose settings globally for other scripts
window.appSettings = {
    get: (key) => currentSettings[key],
    getAll: () => ({ ...currentSettings }),
    set: (key, value) => {
        currentSettings[key] = value;
        saveSettings();
    }
};
