(function() {
    'use strict';

    const API_BASE = 'https://atlas.olympusgames.dev';
    const ME_ENDPOINT = `${API_BASE}/api/me`;
    const LOGOUT_ENDPOINT = `${API_BASE}/api/logout`;
    const ATLAS_URL = `${API_BASE}/embedded`;
    const LOGIN_PAGE = 'file:///assets/login.html';

    // State
    let currentUser = null;
    let currentTab = 'atlas';

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const logoutBtn = document.getElementById('logout-btn');
    const settingsLogoutBtn = document.getElementById('settings-logout');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');
    const settingsUserEmail = document.getElementById('settings-user-email');
    
    // Atlas elements
    const atlasLaunch = document.getElementById('atlas-launch');

    // Git elements
    const repoSelect = document.getElementById('repo-select');
    const gitRefresh = document.getElementById('git-refresh');
    const createBranch = document.getElementById('create-branch');
    const cloneRepo = document.getElementById('clone-repo');
    const commitMessage = document.getElementById('commit-message');
    const commitBtn = document.getElementById('commit-btn');
    const stageAllBtn = document.getElementById('stage-all');
    const pullBtn = document.getElementById('pull-btn');
    const pushBtn = document.getElementById('push-btn');

    // Download elements
    const checkUpdatesBtn = document.getElementById('check-updates');

    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    /**
     * Verify user is authenticated
     * Redirects to login if not authenticated
     */
    async function verifyAuth() {
        // First check localStorage for auth state
        try {
            const isAuth = localStorage.getItem('olympus_authenticated');
            const userData = localStorage.getItem('olympus_user');
            
            if (isAuth === 'true' && userData) {
                currentUser = JSON.parse(userData);
                updateUserInfo();
                return true;
            }
        } catch (error) {
            console.error('Error reading auth state:', error);
        }

        // Not authenticated - redirect to login
        window.location.href = LOGIN_PAGE;
        return false;
    }

    /**
     * Verify auth with API in background
     * If session expired, update UI but don't redirect immediately
     */
    async function verifyWithApi() {
        try {
            const response = await fetch(ME_ENDPOINT, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.ok === true) {
                    // Update stored user data
                    currentUser = data.user || data;
                    localStorage.setItem('olympus_user', JSON.stringify(currentUser));
                    updateUserInfo();
                    return;
                }
            }
            
            // Session may have expired - show warning but don't redirect yet
            console.log('API session may have expired, local session still valid');
        } catch (error) {
            console.log('API verification failed (offline?):', error.message);
        }
    }

    /**
     * Update the user info in the sidebar
     */
    function updateUserInfo() {
        if (!currentUser) return;

        const displayName = currentUser.displayName || currentUser.username || 'User';
        const email = currentUser.email || '';
        const role = currentUser.role || 'Developer';

        userName.textContent = displayName;
        userRole.textContent = role;
        userAvatar.textContent = displayName.charAt(0).toUpperCase();
        
        if (settingsUserEmail) {
            settingsUserEmail.textContent = email || `${displayName.toLowerCase()}@olympusgames.dev`;
        }
    }

    /**
     * Handle logout
     */
    async function handleLogout() {
        // Clear local auth state first
        try {
            localStorage.removeItem('olympus_authenticated');
            localStorage.removeItem('olympus_user');
        } catch (e) {
            console.log('Could not clear local auth state:', e);
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

        // Redirect to login regardless of logout success
        window.location.href = LOGIN_PAGE;
    }

    /**
     * Switch to a different tab
     * @param {string} tabId - The ID of the tab to switch to
     */
    function switchTab(tabId) {
        if (tabId === currentTab) return;

        // Update nav items
        navItems.forEach(item => {
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update tab content
        tabContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        currentTab = tabId;
    }

    /**
     * Navigate to Atlas website
     * This replaces the current view - user can press Alt+Left to go back
     */
    function openAtlas() {
        window.location.href = ATLAS_URL;
    }

    /**
     * Show modal dialog
     * @param {string} title - Modal title
     * @param {string} content - Modal HTML content
     */
    function showModal(title, content) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modalOverlay.hidden = false;
    }

    /**
     * Hide modal dialog
     */
    function hideModal() {
        modalOverlay.hidden = true;
        modalTitle.textContent = '';
        modalContent.innerHTML = '';
    }

    /**
     * Show create branch dialog
     */
    function showCreateBranchDialog() {
        const content = `
            <div class="modal-form">
                <div class="form-group">
                    <label for="branch-name">Branch Name</label>
                    <input type="text" id="branch-name" placeholder="feature/my-feature" class="modal-input">
                </div>
                <div class="form-group">
                    <label for="branch-from">Create from</label>
                    <select id="branch-from" class="modal-select">
                        <option value="main">main</option>
                        <option value="develop">develop</option>
                        <option value="feature/new-ui">feature/new-ui</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="window.hideModal()">Cancel</button>
                    <button class="btn-primary" onclick="window.createNewBranch()">Create Branch</button>
                </div>
            </div>
        `;
        showModal('Create New Branch', content);
    }

    /**
     * Show clone repository dialog
     */
    function showCloneRepoDialog() {
        // Get default clone path from settings if available
        let defaultPath = 'C:\\Repos\\OlympusGames';
        if (typeof appSettings !== 'undefined' && typeof appSettings.get === 'function') {
            defaultPath = appSettings.get('cloneLocation') || defaultPath;
        }
        
        const content = `
            <div class="modal-form">
                <div class="form-group">
                    <label for="repo-url">Repository URL</label>
                    <input type="text" id="repo-url" placeholder="https://github.com/olympus-games/..." class="modal-input">
                </div>
                <div class="form-group">
                    <label for="clone-path">Clone to</label>
                    <div class="input-with-btn">
                        <input type="text" id="clone-path" value="${defaultPath}" class="modal-input" readonly>
                        <button class="btn-secondary" onclick="window.browseClonePath()">Browse</button>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="window.hideModal()">Cancel</button>
                    <button class="btn-primary" onclick="window.cloneRepository()">Clone</button>
                </div>
            </div>
        `;
        showModal('Clone Repository', content);
    }

    /**
     * Browse for clone path
     */
    window.browseClonePath = async function() {
        if (typeof nativeBrowseFolder === 'function') {
            const path = await nativeBrowseFolder();
            if (path) {
                const clonePathInput = document.getElementById('clone-path');
                if (clonePathInput) {
                    clonePathInput.value = path;
                }
            }
        }
    };

    /**
     * Create new branch (placeholder)
     */
    window.createNewBranch = function() {
        const branchName = document.getElementById('branch-name').value;
        const branchFrom = document.getElementById('branch-from').value;
        
        if (!branchName) {
            alert('Please enter a branch name');
            return;
        }

        console.log(`Creating branch ${branchName} from ${branchFrom}`);
        // TODO: Implement actual git branch creation via C++ backend
        hideModal();
        showNotification(`Branch "${branchName}" created successfully`);
    };

    /**
     * Clone repository (placeholder)
     */
    window.cloneRepository = function() {
        const repoUrl = document.getElementById('repo-url').value;
        const clonePath = document.getElementById('clone-path').value;

        if (!repoUrl) {
            alert('Please enter a repository URL');
            return;
        }

        console.log(`Cloning ${repoUrl} to ${clonePath}`);
        // TODO: Implement actual git clone via C++ backend
        hideModal();
        showNotification('Clone started...');
    };

    // Make hideModal globally accessible for modal buttons
    window.hideModal = hideModal;

    /**
     * Show a notification toast
     * @param {string} message - Notification message
     * @param {string} type - 'success', 'error', or 'info'
     */
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    padding: 16px 20px;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
                    z-index: 2000;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { border-left: 3px solid var(--success); }
                .notification-error { border-left: 3px solid var(--error); }
                .notification-info { border-left: 3px solid var(--accent); }
                .notification-close {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                .notification-close:hover { color: var(--text-primary); }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        const timeout = setTimeout(() => {
            notification.remove();
        }, 5000);

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            notification.remove();
        });
    }

    /**
     * Handle commit action (placeholder)
     */
    function handleCommit() {
        const message = commitMessage.value.trim();
        if (!message) {
            showNotification('Please enter a commit message', 'error');
            return;
        }

        console.log('Committing with message:', message);
        // TODO: Implement actual git commit via C++ backend
        commitMessage.value = '';
        showNotification('Changes committed successfully');
    }

    /**
     * Handle push action (placeholder)
     */
    function handlePush() {
        console.log('Pushing to remote...');
        // TODO: Implement actual git push via C++ backend
        showNotification('Pushed to remote successfully');
    }

    /**
     * Handle pull action (placeholder)
     */
    function handlePull() {
        console.log('Pulling from remote...');
        // TODO: Implement actual git pull via C++ backend
        showNotification('Pulled from remote successfully');
    }

    /**
     * Handle stage all action (placeholder)
     */
    function handleStageAll() {
        console.log('Staging all changes...');
        // TODO: Implement actual git add via C++ backend
        showNotification('All changes staged');
    }

    /**
     * Handle check for updates (placeholder)
     */
    function handleCheckUpdates() {
        console.log('Checking for updates...');
        // TODO: Implement actual update check
        showNotification('All applications are up to date', 'info');
    }

    /**
     * Add modal form styles
     */
    function addModalStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .modal-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .modal-form .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .modal-form label {
                font-size: 13px;
                font-weight: 500;
                color: var(--text-secondary);
            }
            .modal-input, .modal-select {
                padding: 12px 14px;
                font-size: 14px;
                color: var(--text-primary);
                background: var(--bg-input);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                outline: none;
            }
            .modal-input:focus, .modal-select:focus {
                border-color: var(--border-focus);
                box-shadow: 0 0 0 3px var(--accent-glow);
            }
            .modal-select option {
                background: var(--bg-card);
            }
            .input-with-btn {
                display: flex;
                gap: 8px;
            }
            .input-with-btn .modal-input {
                flex: 1;
            }
            .modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 8px;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Initialize the dashboard
     */
    async function init() {
        // Add modal form styles
        addModalStyles();

        // Verify authentication first
        const isAuth = await verifyAuth();
        if (!isAuth) return;

        // Tab navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                if (tabId) {
                    switchTab(tabId);
                }
            });
        });

        // Logout handlers
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        if (settingsLogoutBtn) {
            settingsLogoutBtn.addEventListener('click', handleLogout);
        }

        // Atlas tab handlers
        if (atlasLaunch) {
            atlasLaunch.addEventListener('click', openAtlas);
        }

        // Git tab handlers
        if (createBranch) {
            createBranch.addEventListener('click', showCreateBranchDialog);
        }
        if (cloneRepo) {
            cloneRepo.addEventListener('click', showCloneRepoDialog);
        }
        if (commitBtn) {
            commitBtn.addEventListener('click', handleCommit);
        }
        if (stageAllBtn) {
            stageAllBtn.addEventListener('click', handleStageAll);
        }
        if (pullBtn) {
            pullBtn.addEventListener('click', handlePull);
        }
        if (pushBtn) {
            pushBtn.addEventListener('click', handlePush);
        }
        if (gitRefresh) {
            gitRefresh.addEventListener('click', () => {
                console.log('Refreshing git status...');
                showNotification('Git status refreshed', 'info');
            });
        }

        // Downloads tab handlers
        if (checkUpdatesBtn) {
            checkUpdatesBtn.addEventListener('click', handleCheckUpdates);
        }

        // Modal handlers
        if (modalClose) {
            modalClose.addEventListener('click', hideModal);
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    hideModal();
                }
            });
        }

        // Download card button handlers (placeholder)
        document.querySelectorAll('.download-card .btn-primary, .download-card .btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                const card = e.target.closest('.download-card');
                const appName = card.querySelector('h3').textContent;
                
                console.log(`${action} action for ${appName}`);
                
                if (action === 'Launch') {
                    showNotification(`Launching ${appName}...`, 'info');
                } else if (action === 'Verify') {
                    showNotification(`Verifying ${appName}...`, 'info');
                } else if (action === 'Install') {
                    showNotification(`Installing ${appName}...`, 'info');
                } else if (action.startsWith('Update')) {
                    showNotification(`Updating ${appName}...`, 'info');
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modal
            if (e.key === 'Escape' && !modalOverlay.hidden) {
                hideModal();
            }
        });
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
