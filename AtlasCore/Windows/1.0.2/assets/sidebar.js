(function() {
    'use strict';

    const API_BASE = 'https://atlas.olympusgames.dev';
    const LOGOUT_ENDPOINT = `${API_BASE}/api/v1/auth/logout`;
    const PROFILE_ENDPOINT = `${API_BASE}/api/profile`;
    const PROFILE_URL = `${API_BASE}/profile`;

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfoBtn = document.getElementById('user-info-btn');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');

    let currentTab = 'home';

    function normalizeUrl(url) {
        const s = String(url || '').trim();
        // Remove trailing slashes for stable comparisons.
        return s.replace(/\/+$/, '');
    }

    function setActiveTab(tabId) {
        // Update nav items
        navItems.forEach(item => {
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        currentTab = tabId;
    }

    function clearActiveTab() {
        navItems.forEach(item => item.classList.remove('active'));
        currentTab = null;
    }

    // Allow native to sync sidebar selection when content navigates (eg. Home quick actions).
    // This should NOT trigger navigation; it only updates the active state.
    window.sidebarSetActiveByUrl = function sidebarSetActiveByUrl(url) {
        const target = normalizeUrl(url);
        if (!target) return;

        // Profile view intentionally clears sidebar selection.
        if (target.includes('/profile')) {
            clearActiveTab();
            return;
        }

        // Match against declared nav item URLs.
        for (const item of navItems) {
            const itemUrl = normalizeUrl(item.dataset.url);
            if (!itemUrl) continue;

            // Exact match or prefix match (handles query/hash params).
            if (target === itemUrl || target.startsWith(itemUrl + '?') || target.startsWith(itemUrl + '#')) {
                setActiveTab(item.dataset.tab);
                return;
            }

            // Atlas embedded can vary by trailing slash.
            if (item.dataset.tab === 'atlas' && itemUrl && target.startsWith(itemUrl)) {
                setActiveTab('atlas');
                return;
            }
        }
    };

    /**
     * Set avatar to display an image or fallback to initial
     * @param {string|null} avatarUrl - URL of the avatar image
     * @param {string} displayName - User's display name for fallback
     */
    function setAvatar(avatarUrl, displayName) {
        const initial = displayName.charAt(0).toUpperCase();
        
        if (avatarUrl) {
            // Create image element
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = displayName;
            img.className = 'user-avatar-img';
            
            img.onload = function() {
                // Clear existing content and add image
                userAvatar.textContent = '';
                userAvatar.appendChild(img);
                userAvatar.classList.add('has-image');
            };
            
            img.onerror = function() {
                // Fallback to initial on error
                userAvatar.textContent = initial;
                userAvatar.classList.remove('has-image');
            };
        } else {
            // No avatar URL, use initial
            userAvatar.textContent = initial;
            userAvatar.classList.remove('has-image');
        }
    }

    /**
     * Fetch user profile from API to get avatar
     */
    async function fetchUserProfile() {
        try {
            const response = await fetch(PROFILE_ENDPOINT, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const user = data.user || data;
                
                console.log('[Sidebar] Fetched profile:', user);
                
                // Update avatar with fetched data
                const displayName = user.display_name || user.displayName || user.username || 'User';
                const avatarUrl = user.avatar_url || user.avatarUrl || user.avatar || null;
                const role = user.role || (user.is_admin ? 'Admin' : 'Developer');
                
                userName.textContent = displayName;
                userRole.textContent = role;
                setAvatar(avatarUrl, displayName);
                
                // Update localStorage with fresh data
                localStorage.setItem('olympus_user', JSON.stringify(user));
            }
        } catch (e) {
            console.log('[Sidebar] Could not fetch profile:', e);
        }
    }

    /**
     * Load user info from localStorage
     */
    window.loadUserInfo = function loadUserInfo() {
        try {
            const userData = localStorage.getItem('olympus_user');
            console.log('[Sidebar] Loading user data:', userData);
            if (userData) {
                let parsed = JSON.parse(userData);
                // Handle nested { user: {...} } structure from API
                const user = parsed.user || parsed;
                // API returns snake_case: display_name, not displayName
                const displayName = user.display_name || user.displayName || user.username || 'User';
                const role = user.role || (user.is_admin ? 'Admin' : 'Developer');
                const avatarUrl = user.avatar_url || user.avatarUrl || user.avatar || null;
                
                console.log('[Sidebar] Parsed user:', displayName, role);
                userName.textContent = displayName;
                userRole.textContent = role;
                setAvatar(avatarUrl, displayName);
            }
            
            // Fetch fresh profile data from API (includes avatar)
            fetchUserProfile();
        } catch (e) {
            console.log('Could not load user info:', e);
        }
    };

    /**
     * Navigate content area to URL
     * @param {string} url - URL to navigate to
     */
    function navigateTo(url) {
        if (typeof nativeNavigate === 'function') {
            nativeNavigate(url);
        } else {
            console.log('nativeNavigate not available, url:', url);
        }
    }

    /**
     * Switch active tab and navigate
     * @param {string} tabId - Tab ID
     * @param {string} url - URL to navigate to
     */
    function switchTab(tabId, url) {
        if (tabId === currentTab) return;

        setActiveTab(tabId);
        navigateTo(url);
    }

    /**
     * Handle logout
     */
    async function handleLogout() {
        // Clear local auth state
        try {
            localStorage.removeItem('olympus_authenticated');
            localStorage.removeItem('olympus_user');
            localStorage.removeItem('olympus_access_token');
        } catch (e) {
            console.log('Could not clear local auth:', e);
        }

        // Try to logout from API
        try {
            await fetch(LOGOUT_ENDPOINT, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.log('Logout request failed:', error);
        }

        // Call native logout to return to login screen
        if (typeof nativeLogout === 'function') {
            nativeLogout();
        }
    }

    /**
     * Navigate to profile page
     */
    function handleProfileClick() {
        clearActiveTab();
        
        // Navigate to profile
        navigateTo(PROFILE_URL);
    }

    /**
     * Initialize sidebar
     */
    function init() {
        window.loadUserInfo();

        // If native already navigated content before sidebar was ready, it may set
        // a pending URL on the window for us to consume.
        try {
            if (window.__atlascore_pending_content_url) {
                window.sidebarSetActiveByUrl(window.__atlascore_pending_content_url);
                window.__atlascore_pending_content_url = null;
            }
        } catch (e) {
            // ignore
        }

        // Tab navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                const url = item.dataset.url;
                if (tabId && url) {
                    switchTab(tabId, url);
                }
            });
        });

        // Logout handler
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Profile click handler
        if (userInfoBtn) {
            userInfoBtn.addEventListener('click', handleProfileClick);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
