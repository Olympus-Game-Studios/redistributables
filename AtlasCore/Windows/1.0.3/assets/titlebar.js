(function() {
    'use strict';

    // DOM Elements
    const titlebar = document.querySelector('.titlebar');
    const titlebarTitle = document.querySelector('.titlebar-title');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const maximizeBtn = document.querySelector('.maximize-btn');
    const restoreBtn = document.querySelector('.restore-btn');
    const closeBtn = document.querySelector('.close-btn');

    // Window state
    let isMaximized = false;

    /**
     * Handle minimize button click
     */
    function handleMinimize() {
        try {
            if (typeof MinimizeWindow === 'function') {
                MinimizeWindow();
            }
        } catch (error) {
            console.error('Error calling MinimizeWindow:', error);
        }
    }

    /**
     * Handle maximize button click
     */
    function handleMaximize() {
        try {
            if (typeof MaximizeWindow === 'function') {
                MaximizeWindow();
                isMaximized = true;
                updateMaximizeButtons();
            }
        } catch (error) {
            console.error('Error calling MaximizeWindow:', error);
        }
    }

    /**
     * Handle restore button click
     */
    function handleRestore() {
        try {
            if (typeof RestoreWindow === 'function') {
                RestoreWindow();
                isMaximized = false;
                updateMaximizeButtons();
            }
        } catch (error) {
            console.error('Error calling RestoreWindow:', error);
        }
    }

    /**
     * Handle close button click
     */
    function handleClose() {
        try {
            if (typeof CloseWindow === 'function') {
                CloseWindow();
            }
        } catch (error) {
            console.error('Error calling CloseWindow:', error);
        }
    }

    /**
     * Handle window drag
     */
    function handleDragStart(e) {
        // Don't drag if clicking on buttons
        if (e.target.closest('.titlebar-button') || e.target.closest('.titlebar-controls')) {
            return;
        }
        
        try {
            if (typeof StartWindowDrag === 'function') {
                StartWindowDrag();
            }
        } catch (error) {
            console.error('Error calling StartWindowDrag:', error);
        }
    }

    /**
     * Handle double-click to maximize/restore
     */
    function handleDoubleClick(e) {
        // Don't toggle if clicking on buttons
        if (e.target.closest('.titlebar-button') || e.target.closest('.titlebar-controls')) {
            return;
        }
        
        if (isMaximized) {
            handleRestore();
        } else {
            handleMaximize();
        }
    }

    /**
     * Update maximize/restore button visibility
     */
    function updateMaximizeButtons() {
        if (isMaximized) {
            maximizeBtn.classList.add('hidden');
            restoreBtn.classList.remove('hidden');
        } else {
            maximizeBtn.classList.remove('hidden');
            restoreBtn.classList.add('hidden');
        }
    }

    /**
     * Initialize event listeners
     */
    function init() {
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', handleMinimize);
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', handleMaximize);
        }

        if (restoreBtn) {
            restoreBtn.addEventListener('click', handleRestore);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', handleClose);
        }

        // Add drag functionality to titlebar
        if (titlebar) {
            titlebar.addEventListener('mousedown', handleDragStart);
            titlebar.addEventListener('dblclick', handleDoubleClick);
        }

        // Update button visibility on startup
        updateMaximizeButtons();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
