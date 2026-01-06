(function() {
    'use strict';

    const API_BASE = 'https://atlas.olympusgames.dev';
    const PROFILE_ENDPOINT = `${API_BASE}/api/profile`;
    const PASSWORD_ENDPOINT = `${API_BASE}/api/profile/change-password`;

    // DOM Elements - Profile Display
    const profileAvatar = document.getElementById('profile-avatar');
    const avatarInitials = document.getElementById('avatar-initials');
    const avatarImage = document.getElementById('avatar-image');
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileUsername = document.getElementById('profile-username');
    const profileRole = document.getElementById('profile-role');
    
    // Stats
    const statProjects = document.getElementById('stat-projects');
    const statContributions = document.getElementById('stat-contributions');
    const statJoined = document.getElementById('stat-joined');
    
    // Profile Form
    const profileForm = document.getElementById('profile-form');
    const displayNameInput = document.getElementById('display-name');
    const emailInput = document.getElementById('email');
    const bioInput = document.getElementById('bio');
    const avatarUrlInput = document.getElementById('avatar-url');
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');
    const profileMessage = document.getElementById('profile-message');
    
    // Password Form
    const passwordForm = document.getElementById('password-form');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordMessage = document.getElementById('password-message');
    
    // Account Info
    const accountUsername = document.getElementById('account-username');
    const accountId = document.getElementById('account-id');
    const accountType = document.getElementById('account-type');
    const accountLastLogin = document.getElementById('account-last-login');
    
    // Change Avatar Button
    const changeAvatarBtn = document.getElementById('change-avatar-btn');

    // Store original profile data for reset
    let originalProfile = null;

    /**
     * Get the authentication token from localStorage
     */
    function getAuthToken() {
        return localStorage.getItem('olympus_access_token');
    }

    /**
     * Make authenticated API request
     */
    async function apiRequest(url, options = {}) {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include'
        });

        return response;
    }

    /**
     * Show message on a form
     */
    function showMessage(element, message, isError = false) {
        element.textContent = message;
        element.className = `form-message ${isError ? 'error' : 'success'}`;
        element.hidden = false;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.hidden = true;
        }, 5000);
    }

    /**
     * Set loading state on a button
     */
    function setButtonLoading(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        button.disabled = isLoading;
        if (btnText) btnText.hidden = isLoading;
        if (btnLoading) btnLoading.hidden = !isLoading;
    }

    /**
     * Format date for display
     */
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Format relative time
     */
    function formatRelativeTime(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return formatDate(dateString);
    }

    /**
     * Get initials from display name
     */
    function getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    }

    /**
     * Update avatar display
     */
    function updateAvatar(avatarUrl, displayName) {
        const initials = getInitials(displayName);
        avatarInitials.textContent = initials;
        
        if (avatarUrl) {
            avatarImage.src = avatarUrl;
            avatarImage.style.display = 'block';
            avatarInitials.style.display = 'none';
            
            // Handle image load error
            avatarImage.onerror = () => {
                avatarImage.style.display = 'none';
                avatarInitials.style.display = 'block';
            };
        } else {
            avatarImage.style.display = 'none';
            avatarInitials.style.display = 'block';
        }
    }

    /**
     * Populate profile data into the UI
     */
    function populateProfile(profile) {
        originalProfile = profile;
        
        // Header display
        const displayName = profile.display_name || profile.displayName || profile.username || 'User';
        profileDisplayName.textContent = displayName;
        profileUsername.textContent = `@${profile.username || 'user'}`;
        
        // Role
        const isAdmin = profile.is_admin || profile.isAdmin || profile.role === 'admin';
        const role = isAdmin ? 'Administrator' : (profile.role || 'Developer');
        profileRole.textContent = role;
        if (isAdmin) {
            profileRole.classList.add('admin');
        }
        
        // Avatar
        const avatarUrl = profile.avatar_url || profile.avatarUrl || profile.avatar || '';
        updateAvatar(avatarUrl, displayName);
        
        // Stats
        statProjects.textContent = profile.project_count || profile.projectCount || '0';
        statContributions.textContent = profile.contribution_count || profile.contributionCount || '-';
        statJoined.textContent = formatDate(profile.created_at || profile.createdAt);
        
        // Form fields
        displayNameInput.value = displayName;
        emailInput.value = profile.email || '';
        bioInput.value = profile.bio || '';
        avatarUrlInput.value = avatarUrl;
        
        // Account info
        accountUsername.textContent = profile.username || '-';
        accountId.textContent = profile.id || '-';
        accountType.textContent = isAdmin ? 'Admin' : 'User';
        if (isAdmin) {
            accountType.classList.add('admin');
        }
        accountLastLogin.textContent = formatRelativeTime(profile.last_login_at || profile.lastLoginAt);

        // Update sidebar user info if the function exists
        if (typeof window.parent !== 'undefined' && window.parent.loadUserInfo) {
            try {
                localStorage.setItem('olympus_user', JSON.stringify(profile));
                window.parent.loadUserInfo();
            } catch (e) {
                console.log('Could not update sidebar:', e);
            }
        }
    }

    /**
     * Load profile from API
     */
    async function loadProfile() {
        try {
            const response = await apiRequest(PROFILE_ENDPOINT);
            
            if (response.ok) {
                const profile = await response.json();
                populateProfile(profile);
            } else if (response.status === 401) {
                showMessage(profileMessage, 'Session expired. Please log in again.', true);
            } else {
                // Try to load from localStorage as fallback
                const cached = localStorage.getItem('olympus_user');
                if (cached) {
                    const profile = JSON.parse(cached);
                    populateProfile(profile.user || profile);
                }
                showMessage(profileMessage, 'Could not load profile from server.', true);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            // Try localStorage fallback
            try {
                const cached = localStorage.getItem('olympus_user');
                if (cached) {
                    const profile = JSON.parse(cached);
                    populateProfile(profile.user || profile);
                }
            } catch (e) {
                console.error('No cached profile available');
            }
            showMessage(profileMessage, 'Network error. Showing cached profile.', true);
        }
    }

    /**
     * Save profile changes
     */
    async function saveProfile(event) {
        event.preventDefault();
        
        setButtonLoading(saveBtn, true);
        profileMessage.hidden = true;

        const updates = {
            display_name: displayNameInput.value.trim(),
            email: emailInput.value.trim(),
            bio: bioInput.value.trim(),
            avatar_url: avatarUrlInput.value.trim()
        };

        try {
            const response = await apiRequest(PROFILE_ENDPOINT, {
                method: 'PATCH',
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                populateProfile(updatedProfile);
                showMessage(profileMessage, 'Profile updated successfully!', false);
                
                // Update localStorage
                localStorage.setItem('olympus_user', JSON.stringify(updatedProfile));
                
                // Try to update sidebar
                if (typeof window.loadUserInfo === 'function') {
                    window.loadUserInfo();
                }
            } else {
                const error = await response.json().catch(() => ({}));
                showMessage(profileMessage, error.error || 'Failed to update profile.', true);
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            showMessage(profileMessage, 'Network error. Please try again.', true);
        } finally {
            setButtonLoading(saveBtn, false);
        }
    }

    /**
     * Reset form to original values
     */
    function resetForm() {
        if (originalProfile) {
            populateProfile(originalProfile);
            profileMessage.hidden = true;
        }
    }

    /**
     * Change password
     */
    async function changePassword(event) {
        event.preventDefault();
        
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage(passwordMessage, 'Please fill in all password fields.', true);
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage(passwordMessage, 'New passwords do not match.', true);
            return;
        }

        if (newPassword.length < 8) {
            showMessage(passwordMessage, 'New password must be at least 8 characters.', true);
            return;
        }

        setButtonLoading(changePasswordBtn, true);
        passwordMessage.hidden = true;

        try {
            const response = await apiRequest(PASSWORD_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (response.ok) {
                showMessage(passwordMessage, 'Password changed successfully!', false);
                // Clear password fields
                currentPasswordInput.value = '';
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
            } else {
                const error = await response.json().catch(() => ({}));
                showMessage(passwordMessage, error.error || 'Failed to change password.', true);
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            showMessage(passwordMessage, 'Network error. Please try again.', true);
        } finally {
            setButtonLoading(changePasswordBtn, false);
        }
    }

    /**
     * Handle avatar URL preview
     */
    function previewAvatar() {
        const url = avatarUrlInput.value.trim();
        const displayName = displayNameInput.value.trim() || originalProfile?.display_name || 'User';
        updateAvatar(url, displayName);
    }

    /**
     * Focus avatar URL input when clicking change avatar button
     */
    function handleChangeAvatarClick() {
        avatarUrlInput.focus();
        avatarUrlInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Initialize profile page
     */
    function init() {
        // Load profile data
        loadProfile();

        // Form submission handlers
        profileForm.addEventListener('submit', saveProfile);
        passwordForm.addEventListener('submit', changePassword);

        // Reset button
        resetBtn.addEventListener('click', resetForm);

        // Avatar URL preview on change
        avatarUrlInput.addEventListener('blur', previewAvatar);
        avatarUrlInput.addEventListener('input', debounce(previewAvatar, 500));

        // Change avatar button
        changeAvatarBtn.addEventListener('click', handleChangeAvatarClick);
    }

    /**
     * Debounce helper
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
