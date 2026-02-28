(function() {
    'use strict';

    const API_BASE = 'https://atlas.olympusgames.dev';
    const ME_ENDPOINT = `${API_BASE}/api/me`;

    // DOM Elements
    const statusGrid = document.querySelector('.status-grid');
    const activityList = document.querySelector('.activity-list');
    const appsStatusGrid = document.querySelector('.apps-status-grid');

    // Downloads/manifest configuration (mirrors downloads.js)
    const GITHUB_ORG = 'Olympus-Game-Studios';
    const GITHUB_REPO = 'redistributables';
    const MANIFEST_URL = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/main/manifest.json`;
    const ATLASCORE_PRODUCT_NAME = 'AtlasCore';

    /**
     * Navigate to a URL using native function if available
     */
    window.navigateTo = function(url) {
        if (typeof nativeNavigate === 'function') {
            nativeNavigate(url);
        } else {
            window.location.href = url;
        }
    };

    // Compare semantic versions (same behavior as downloads.js)
    function compareVersions(a, b) {
        const normalize = (v) => {
            const s = String(v || '');
            // Handle formats like "0.0.9-nightly-20251224" (or any suffix)
            const match = s.match(/^(\d+)\.(\d+)\.(\d+)/);
            if (match) {
                return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
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
        return String(a || '').localeCompare(String(b || ''));
    }

    async function getAppInfoSafe() {
        if (typeof nativeGetAppInfo !== 'function') return null;
        try {
            return await nativeGetAppInfo();
        } catch (e) {
            console.warn('nativeGetAppInfo failed:', e);
            return null;
        }
    }

    function loadInstalledItemsSnapshot() {
        // Prefer native file-backed storage (same as downloads.js)
        try {
            if (typeof nativeLoadInstalledItems === 'function') {
                const result = nativeLoadInstalledItems();
                if (result) return JSON.parse(result);
            }
        } catch (e) {
            console.warn('Could not load installed items from native storage:', e);
        }
        // Fallback to localStorage
        try {
            const stored = localStorage.getItem('atlas_installed_items');
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.warn('Could not load installed items from localStorage:', e);
        }
        return {};
    }

    async function fetchManifestJson() {
        try {
            if (typeof nativeFetchUrl === 'function') {
                const res = await nativeFetchUrl(MANIFEST_URL);
                if (typeof res === 'string') return JSON.parse(res);
                if (res && typeof res.body === 'string') return JSON.parse(res.body);
            }
        } catch (e) {
            console.warn('nativeFetchUrl manifest failed:', e);
        }

        try {
            const response = await fetch(MANIFEST_URL, { method: 'GET' });
            if (!response.ok) return null;
            return await response.json();
        } catch (e) {
            console.warn('fetch manifest failed:', e);
            return null;
        }
    }

    function getInstalledProductVersions(installedItems) {
        // installedItems keys look like "Product@Version".
        const products = new Map();
        for (const [key, value] of Object.entries(installedItems || {})) {
            if (!value || value.installed !== true) continue;
            const at = key.lastIndexOf('@');
            if (at <= 0 || at === key.length - 1) continue;
            const name = key.slice(0, at);
            const version = key.slice(at + 1);
            if (!products.has(name)) products.set(name, []);
            products.get(name).push(version);
        }
        // pick highest installed version per product
        const out = [];
        for (const [name, versions] of products.entries()) {
            let best = versions[0];
            for (const v of versions.slice(1)) {
                if (compareVersions(v, best) > 0) best = v;
            }
            out.push({ name, installedVersion: best });
        }
        return out.sort((a, b) => a.name.localeCompare(b.name));
    }

    function getLatestManifestVersions(manifest) {
        const out = new Map();
        const products = manifest && Array.isArray(manifest.products) ? manifest.products : [];
        for (const p of products) {
            if (!p || !p.name) continue;
            const versions = Array.isArray(p.versions) ? p.versions : [];
            let best = null;
            for (const v of versions) {
                const ver = v && (v.version || v.ver);
                if (!ver) continue;
                if (!best || compareVersions(ver, best) > 0) best = ver;
            }
            if (best) out.set(p.name, { latestVersion: best, displayName: p.displayName || p.name });
        }
        return out;
    }

    /**
     * Get system status by checking actual services
     */
    async function getSystemStatus() {
        const statusItems = [];

        // Check Atlas Connection
        let atlasStatus = { label: 'Atlas Connection', status: 'error', display: 'Offline' };
        try {
            const response = await fetch(ME_ENDPOINT, {
                method: 'GET',
                credentials: 'include',
                signal: AbortSignal.timeout(5000)
            });
            if (response.ok) {
                atlasStatus = { label: 'Atlas Connection', status: 'ok', display: 'Connected' };
            } else if (response.status === 401) {
                atlasStatus = { label: 'Atlas Connection', status: 'warning', display: 'Not logged in' };
            }
        } catch (error) {
            atlasStatus = { label: 'Atlas Connection', status: 'error', display: 'Offline' };
        }
        statusItems.push(atlasStatus);

        // Atlas Core Version (from app_info.cmake via nativeGetAppInfo)
        let versionDisplay = 'Unknown';
        const appInfo = await getAppInfoSafe();
        if (appInfo && appInfo.version) {
            versionDisplay = String(appInfo.version);
        }
        statusItems.push({ label: 'Atlas Core', status: 'ok', display: versionDisplay });

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('olympus_authenticated') === 'true';
        statusItems.push({
            label: 'Login Status',
            status: isLoggedIn ? 'ok' : 'warning',
            display: isLoggedIn ? 'Logged in' : 'Not logged in'
        });

        return statusItems;
    }

    /**
     * Add an activity to the recent activity log
     */
    function logActivity(type, title) {
        try {
            const activities = JSON.parse(localStorage.getItem('atlas_activities') || '[]');
            activities.unshift({
                type: type,
                title: title,
                timestamp: new Date().toISOString()
            });
            // Keep only the last 20 activities
            if (activities.length > 20) {
                activities.length = 20;
            }
            localStorage.setItem('atlas_activities', JSON.stringify(activities));
        } catch (e) {
            console.warn('Could not log activity:', e);
        }
    }

    // Make logActivity globally accessible
    window.logActivity = logActivity;

    /**
     * Get recent activity from localStorage
     */
    function getRecentActivity() {
        try {
            const activities = JSON.parse(localStorage.getItem('atlas_activities') || '[]');
            if (activities.length === 0) {
                // Return a welcome activity if no activities yet
                return [{
                    type: 'atlas',
                    title: 'Welcome to Atlas Core',
                    timestamp: new Date().toISOString()
                }];
            }

            // Show at most the last 3 login entries in the list.
            const limited = [];
            let loginCount = 0;
            for (const activity of activities) {
                const title = String(activity && activity.title ? activity.title : '');
                const isLogin = activity && (activity.event === 'login' || /^Logged in as\b/i.test(title));
                if (isLogin) {
                    if (loginCount >= 3) continue;
                    loginCount++;
                }
                limited.push(activity);
                if (limited.length >= 10) break;
            }

            return limited;
        } catch (e) {
            return [{
                type: 'atlas',
                title: 'Welcome to Atlas Core',
                timestamp: new Date().toISOString()
            }];
        }
    }

    /**
     * Get status badge class based on status value
     */
    function getStatusBadgeClass(status) {
        if (status === 'ok' || status === 'connected' || status === 'up-to-date') {
            return 'ok';
        } else if (status === 'warning' || status === 'update-available') {
            return 'warning';
        } else if (status === 'error' || status === 'disconnected') {
            return 'error';
        }
        return 'warning';
    }

    /**
     * Format time difference for activity items
     */
    function formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        
        const days = Math.floor(hours / 24);
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        
        return date.toLocaleDateString();
    }

    /**
     * Get activity icon class based on activity type
     */
    function getActivityIconClass(type) {
        const typeMap = {
            'update': 'update',
            'git': 'git',
            'commit': 'git',
            'push': 'git',
            'pull': 'git',
            'atlas': 'atlas',
            'task': 'atlas'
        };
        return typeMap[type] || 'atlas';
    }

    /**
     * Render system status
     */
    async function loadSystemStatus() {
        if (!statusGrid) return;

        const statusItems = await getSystemStatus();

        // Clear and render
        statusGrid.innerHTML = '';

        statusItems.forEach(item => {
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            
            const label = document.createElement('span');
            label.className = 'status-label';
            label.textContent = item.label;
            
            const badge = document.createElement('span');
            badge.className = `status-badge ${getStatusBadgeClass(item.status)}`;
            badge.textContent = item.display;
            
            statusItem.appendChild(label);
            statusItem.appendChild(badge);
            statusGrid.appendChild(statusItem);
        });
    }

    async function loadInstalledAppsStatus() {
        if (!appsStatusGrid) return;

        const installedItems = loadInstalledItemsSnapshot();
        // Ignore stale entries for AtlasCore; use native app version instead.
        const installedProducts = getInstalledProductVersions(installedItems)
            .filter(p => p.name !== ATLASCORE_PRODUCT_NAME);

        appsStatusGrid.innerHTML = '';

        const manifest = await fetchManifestJson();
        const latestByName = manifest ? getLatestManifestVersions(manifest) : new Map();

        // Always include Atlas Core itself
        const appInfo = await getAppInfoSafe();
        if (appInfo && appInfo.version) {
            const manifestInfo = latestByName.get(ATLASCORE_PRODUCT_NAME);
            const latestVersion = manifestInfo ? manifestInfo.latestVersion : null;
            const displayName = manifestInfo ? manifestInfo.displayName : 'Atlas Core';

            let status = 'ok';
            let display = `Installed ${appInfo.version}`;

            if (latestVersion) {
                const cmp = compareVersions(appInfo.version, latestVersion);
                if (cmp >= 0) {
                    status = 'ok';
                    display = `Up to date (${appInfo.version})`;
                } else {
                    status = 'warning';
                    display = `Update available (${latestVersion})`;
                }
            }

            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';

            const label = document.createElement('span');
            label.className = 'status-label';
            label.textContent = displayName;

            const badge = document.createElement('span');
            badge.className = `status-badge ${getStatusBadgeClass(status)}`;
            badge.textContent = display;

            statusItem.appendChild(label);
            statusItem.appendChild(badge);
            appsStatusGrid.appendChild(statusItem);
        }

        if (installedProducts.length === 0) {
            // If nothing besides Atlas Core is installed, stop here.
            return;
        }

        for (const product of installedProducts) {
            const manifestInfo = latestByName.get(product.name);
            const latestVersion = manifestInfo ? manifestInfo.latestVersion : null;
            const displayName = manifestInfo ? manifestInfo.displayName : product.name;

            let status = 'warning';
            let display = `Installed ${product.installedVersion}`;

            if (latestVersion) {
                const cmp = compareVersions(product.installedVersion, latestVersion);
                if (cmp >= 0) {
                    status = 'ok';
                    display = `Up to date (${product.installedVersion})`;
                } else {
                    status = 'warning';
                    display = `Update available (${latestVersion})`;
                }
            }

            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';

            const label = document.createElement('span');
            label.className = 'status-label';
            label.textContent = displayName;

            const badge = document.createElement('span');
            badge.className = `status-badge ${getStatusBadgeClass(status)}`;
            badge.textContent = display;

            statusItem.appendChild(label);
            statusItem.appendChild(badge);
            appsStatusGrid.appendChild(statusItem);
        }
    }

    /**
     * Render recent activity
     */
    function loadRecentActivity() {
        if (!activityList) return;

        const activities = getRecentActivity();

        // Clear and render
        activityList.innerHTML = '';

        const svgMap = {
            'update': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
            'git': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>',
            'atlas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>'
        };

        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const icon = document.createElement('div');
            const iconClass = getActivityIconClass(activity.type);
            icon.className = `activity-icon ${iconClass}`;
            icon.innerHTML = svgMap[iconClass] || svgMap['atlas'];
            
            const info = document.createElement('div');
            info.className = 'activity-info';
            
            const title = document.createElement('span');
            title.className = 'activity-title';
            title.textContent = activity.title;
            
            const timeEl = document.createElement('span');
            timeEl.className = 'activity-time';
            timeEl.textContent = formatTimeAgo(activity.timestamp);
            
            info.appendChild(title);
            info.appendChild(timeEl);
            
            activityItem.appendChild(icon);
            activityItem.appendChild(info);
            activityList.appendChild(activityItem);
        });
    }

    /**
     * Initialize home page
     */
    async function init() {
        await loadSystemStatus();
        await loadInstalledAppsStatus();
        loadRecentActivity();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
