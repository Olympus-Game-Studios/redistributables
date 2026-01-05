(function() {
    'use strict';

    const API_BASE = 'https://atlas.olympusgames.dev'; 
    const LOGIN_ENDPOINT = `${API_BASE}/api/v1/auth/login`;
    const ME_ENDPOINT = `${API_BASE}/api/v1/auth/me`;
    // Redirect to dashboard after successful login (instead of directly to Atlas)
    const REDIRECT_URL = 'file:///assets/dashboard.html';

    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const loginCard = document.querySelector('.login-card');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const errorMessage = document.getElementById('error-message');

    /**
     * Show error message to the user
     * @param {string} message - Error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }

    /**
     * Hide the error message
     */
    function hideError() {
        errorMessage.hidden = true;
        errorMessage.textContent = '';
    }

    /**
     * Set the loading state of the form
     * @param {boolean} isLoading - Whether the form is in loading state
     */
    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        usernameInput.disabled = isLoading;
        passwordInput.disabled = isLoading;
        
        if (isLoading) {
            btnText.hidden = true;
            btnLoading.hidden = false;
        } else {
            btnText.hidden = false;
            btnLoading.hidden = true;
        }
    }

    /**
     * Redirect to the dashboard after successful login
     * @param {Object} userData - User data from the login response
     * @param {string} accessToken - JWT access token from login
     */
    function redirectToDashboard(userData, usernameForBootstrap, passwordForBootstrap, accessToken) {
        // Store user data and token in localStorage for the dashboard to use
        const userJson = JSON.stringify(userData);
        try {
            localStorage.setItem('olympus_user', userJson);
            localStorage.setItem('olympus_authenticated', 'true');
            if (accessToken) {
                localStorage.setItem('olympus_access_token', accessToken);
            }
        } catch (e) {
            console.log('Could not store auth state:', e);
        }
        
        // Call native function to switch to dashboard view, passing user data.
        // Also pass username/password and token so native can establish Atlas session.
        if (typeof nativeLogin === 'function') {
            nativeLogin(userJson, usernameForBootstrap || '', passwordForBootstrap || '', accessToken || '');
        } else {
            // Fallback to redirect if native not available
            window.location.href = REDIRECT_URL;
        }
    }

    /**
     * Check if user is already authenticated
     * Called on page load to skip login if session exists
     */
    async function checkExistingSession() {
        loginCard.classList.add('checking');
        
        // First check localStorage for existing auth
        try {
            const isAuth = localStorage.getItem('olympus_authenticated');
            const userData = localStorage.getItem('olympus_user');
            const accessToken = localStorage.getItem('olympus_access_token');
            
            if (isAuth === 'true' && userData && accessToken) {
                // Verify the session is still valid with the API using Bearer token
                const response = await fetch(ME_ENDPOINT, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        // Update stored user data and redirect
                        localStorage.setItem('olympus_user', JSON.stringify(data));
                        redirectToDashboard(data, '', '', accessToken);
                        return;
                    }
                }
                // Session expired - clear local storage
                localStorage.removeItem('olympus_authenticated');
                localStorage.removeItem('olympus_user');
                localStorage.removeItem('olympus_access_token');
            }
        } catch (error) {
            // Network error or other issue - stay on login page
            console.log('Session check failed:', error.message);
        }
        
        loginCard.classList.remove('checking');
        usernameInput.focus();
    }

    /**
     * Handle login form submission
     * @param {Event} event - Form submit event
     */
    async function handleLogin(event) {
        event.preventDefault();
        hideError();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Basic validation
        if (!username || !password) {
            showError('Please enter both username and password.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(LOGIN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.access_token) {
                    // JWT token received - fetch user info with token
                    const meResponse = await fetch(ME_ENDPOINT, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${data.access_token}`
                        }
                    });
                    
                    let userData = { username: username };
                    if (meResponse.ok) {
                        try {
                            userData = await meResponse.json();
                        } catch (e) {
                            console.log('Could not parse /me response:', e);
                        }
                    }
                    
                    // Store user info and redirect to dashboard
                    redirectToDashboard(userData, username, password, data.access_token);
                    return;
                } else {
                    // Response was ok but no token
                    showError(data.detail || 'Login failed. No token received.');
                }
            } else if (response.status === 401 || response.status === 403) {
                showError('Invalid username or password.');
            } else if (response.status === 429) {
                showError('Too many login attempts. Please try again later.');
            } else {
                // Try to get error message from response
                try {
                    const errorData = await response.json();
                    showError(errorData.detail || 'Login failed. Please try again.');
                } catch {
                    showError('Login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Unable to connect. Please check your internet connection.');
        }

        setLoading(false);
    }

    /**
     * Initialize the login page
     */
    function init() {
        // Check for existing session on page load
        checkExistingSession();

        // Form submission handler
        loginForm.addEventListener('submit', handleLogin);

        // Clear error when user starts typing
        usernameInput.addEventListener('input', hideError);
        passwordInput.addEventListener('input', hideError);

        // Handle Enter key in inputs
        usernameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginForm.requestSubmit();
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
