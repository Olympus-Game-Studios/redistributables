/**
 * Global link handler that intercepts clicks on links and external URLs
 * Opens external/http/https links in the default browser
 * Internal file:// links navigate within the app
 */
(function() {
    'use strict';

    /**
     * Determine if a URL is external (should be opened in browser)
     * @param {string} url - The URL to check
     * @returns {boolean} - True if URL should open in default browser
     */
    function isExternalUrl(url) {
        if (!url) return false;

        const u = String(url).trim();
        // Treat http(s) as external browser, and mailto as external handler.
        if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('mailto:')) {
            return true;
        }
        return false;
    }

    /**
     * Open a URL in the default browser
     * @param {string} url - The URL to open
     */
    function openInDefaultBrowser(url) {
        if (!url) return;
        const u = String(url);
        if (typeof nativeOpenUrl === 'function') {
            nativeOpenUrl(u);
            return;
        }
        // Fallback: best-effort.
        try {
            window.open(u, '_blank', 'noopener');
        } catch (e) {
            try { window.location.href = u; } catch (_) {}
        }
    }

    // Some pages (eg. docs) set target="_blank" which relies on window.open.
    // Overriding this makes external links consistently open in the system browser.
    try {
        const originalWindowOpen = window.open;
        window.open = function(url, target, features) {
            if (isExternalUrl(url)) {
                openInDefaultBrowser(url);
                return null;
            }
            return originalWindowOpen.call(window, url, target, features);
        };
    } catch (e) {
        // ignore
    }

    /**
     * Handle clicks on anchor tags
     */
    document.addEventListener('click', function(event) {
        // Find the closest anchor tag
        let target = event.target;
        let link = null;
        
        while (target && target !== document) {
            if (target.tagName === 'A' || target.tagName === 'a') {
                link = target;
                break;
            }
            target = target.parentElement;
        }
        
        // If we found an anchor tag
        if (link) {
            // Prefer the resolved href (absolute), fallback to raw attribute.
            const resolvedHref = link.href || link.getAttribute('href');

            if (resolvedHref && isExternalUrl(resolvedHref)) {
                event.preventDefault();
                event.stopPropagation();
                openInDefaultBrowser(resolvedHref);
            }
        }
    }, true); // Use capture phase to intercept before other listeners

    /**
     * Also handle right-click context menu for links
     * This ensures external links still open in browser when right-clicked
     */
    document.addEventListener('contextmenu', function(event) {
        let target = event.target;
        let link = null;
        
        while (target && target !== document) {
            if (target.tagName === 'A' || target.tagName === 'a') {
                link = target;
                break;
            }
            target = target.parentElement;
        }
        
        // For external links, we don't need to do anything special
        // The browser's default context menu behavior will handle it
    }, true);

    // Expose functions globally for programmatic use if needed
    window.openExternalUrl = function(url) {
        if (isExternalUrl(url)) openInDefaultBrowser(url);
    };

    console.log('[Atlas Core] Link handler initialized - external links will open in default browser');
})();
