(function() {
    'use strict';

    // Local docs path (relative to assets folder)
    const DOCS_BASE = 'file:///assets/docs';
    let currentSection = 'Public';
    let docStructure = null;

    // DOM Elements
    const docsNav = document.getElementById('docs-nav');
    const contentArea = document.getElementById('content-area');
    const docTitle = document.getElementById('doc-title');
    const sectionBtns = document.querySelectorAll('.section-btn');

    /**
     * Fetch local file
     */
    async function fetchLocalFile(path) {
        const url = `${DOCS_BASE}/${path}`;
        
        console.log('[Docs] Fetching:', url);
        
        try {
            const response = await fetch(url);

            console.log('[Docs] Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error('[Docs] Fetch error:', error);
            throw error;
        }
    }

    /**
     * Find the first README or markdown file in the structure
     */
    function findFirstDocument(items, parentPath = '') {
        // First pass: look for README.md at this level
        for (const item of items) {
            if (item.type === 'file' && item.name.toLowerCase() === 'readme.md') {
                return parentPath ? `${parentPath}/${item.name}` : item.name;
            }
        }
        
        // Second pass: look in subdirectories
        for (const item of items) {
            if (item.type === 'dir' && item.children) {
                const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name;
                const found = findFirstDocument(item.children, itemPath);
                if (found) return found;
            }
        }
        
        // Third pass: return any markdown file
        for (const item of items) {
            if (item.type === 'file' && item.name.endsWith('.md')) {
                return parentPath ? `${parentPath}/${item.name}` : item.name;
            }
        }
        
        return null;
    }

    /**
     * Expand folders in the path to a document
     */
    function expandPathToDocument(path) {
        const parts = path.split('/');
        let currentPath = '';
        
        // Expand each folder in the path (except the file itself)
        for (let i = 0; i < parts.length - 1; i++) {
            currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
            const folder = docsNav.querySelector(`.nav-folder-toggle[data-path="${currentPath}"]`);
            if (folder) {
                folder.closest('.nav-folder').classList.add('open');
            }
        }
        
        // Mark the file as active
        const fileBtn = docsNav.querySelector(`.nav-file[data-path="${path}"]`);
        if (fileBtn) {
            fileBtn.classList.add('active');
        }
    }

    /**
     * Load and parse structure.json for current section
     */
    async function loadStructure() {
        try {
            docsNav.innerHTML = '<div class="loading"><div class="loading-spinner"></div><span>Loading documentation...</span></div>';
            const structureJson = await fetchLocalFile(`${currentSection}/.structure.json`);
            const structure = JSON.parse(structureJson);
            docStructure = structure;
            const navHtml = buildNavigation(structure);
            docsNav.innerHTML = navHtml;
            
            // Auto-load the first README or document
            const firstDoc = findFirstDocument(structure);
            if (firstDoc) {
                expandPathToDocument(firstDoc);
                await loadDocument(firstDoc);
            }
        } catch (error) {
            console.error('Failed to load structure:', error);
            docsNav.innerHTML = '<div class="error">Failed to load documentation structure</div>';
        }
    }

    /**
     * Build navigation tree HTML from structure
     */
    function buildNavigation(items, parentPath = '') {
        // Sort items: folders first, then files, alphabetically within each group
        const sortedItems = [...items].sort((a, b) => {
            // Folders come before files
            if (a.type === 'dir' && b.type !== 'dir') return -1;
            if (a.type !== 'dir' && b.type === 'dir') return 1;
            // Alphabetical within same type
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        });
        
        return sortedItems.map((item) => {
            const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name;
            
            if (item.type === 'dir') {
                const childrenHtml = item.children ? buildNavigation(item.children, itemPath) : '';
                return `
                    <div class="nav-folder">
                        <button class="nav-folder-toggle" data-path="${itemPath}">
                            <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                            <span>${item.name}</span>
                        </button>
                        <div class="nav-subfolder" data-path="${itemPath}">
                            ${childrenHtml}
                        </div>
                    </div>
                `;
            } else if (item.type === 'file' && item.name.endsWith('.md')) {
                const displayName = item.name.replace('.md', '');
                return `
                    <button class="nav-file" data-path="${itemPath}">
                        <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                        </svg>
                        <span>${displayName}</span>
                    </button>
                `;
            }
            return '';
        }).join('');
    }

    /**
     * Track the current document path for resolving relative links
     */
    let currentDocPath = '';

    /**
     * Load and render markdown file
     */
    async function loadDocument(path) {
        try {
            contentArea.innerHTML = '<div class="loading">Loading document...</div>';
            const filePath = `${currentSection}/${path}`;
            const markdown = await fetchLocalFile(filePath);
            
            // Store current path for relative link resolution
            currentDocPath = path;
            
            // Simple markdown to HTML conversion
            const html = markdownToHtml(markdown);
            
            // Extract title from path
            const title = path.split('/').pop().replace('.md', '');
            docTitle.textContent = title;
            
            contentArea.innerHTML = html;
            contentArea.scrollTop = 0;

            // Apply syntax highlighting first so language detection is accurate.
            applySyntaxHighlighting();
            
            // Add copy buttons to code blocks
            addCopyButtons();
            
            // Process internal links
            processDocumentLinks();
        } catch (error) {
            console.error('Failed to load document:', error);
            contentArea.innerHTML = '<div class="error">Failed to load document</div>';
        }
    }

    /**
     * Process links in the document to handle internal markdown links
     */
    function processDocumentLinks() {
        const links = contentArea.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip external links, anchors, and non-markdown links
            if (href.startsWith('http://') || href.startsWith('https://') || 
                href.startsWith('mailto:') || href.startsWith('#')) {
                // External links should open in system browser
                if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const url = link.href || href;
                        if (typeof nativeOpenUrl === 'function') {
                            nativeOpenUrl(url);
                        } else {
                            window.open(url, '_blank', 'noopener');
                        }
                    });
                }
                return;
            }
            
            // Handle internal markdown links
            if (href.endsWith('.md') || !href.includes('.')) {
                link.addEventListener('click', async (e) => {
                    e.preventDefault();
                    
                    // Resolve the link path relative to current document
                    const resolvedPath = resolveRelativePath(currentDocPath, href);
                    
                    // Ensure .md extension
                    const finalPath = resolvedPath.endsWith('.md') ? resolvedPath : resolvedPath + '.md';
                    
                    // Update navigation state
                    docsNav.querySelectorAll('.nav-file').forEach(f => f.classList.remove('active'));
                    expandPathToDocument(finalPath);
                    
                    // Load the document
                    await loadDocument(finalPath);
                });
            }
        });
    }

    /**
     * Resolve a relative path from the current document location
     */
    function resolveRelativePath(currentPath, relativePath) {
        // Remove the filename from current path to get the directory
        const pathParts = currentPath.split('/');
        pathParts.pop(); // Remove filename
        
        // Handle the relative path
        const relParts = relativePath.split('/');
        
        for (const part of relParts) {
            if (part === '..') {
                pathParts.pop();
            } else if (part !== '.' && part !== '') {
                pathParts.push(part);
            }
        }
        
        return pathParts.join('/');
    }

    /**
     * Apply highlight.js to all code blocks.
     * This adds token spans and the `.hljs` class needed for coloring.
     */
    function applySyntaxHighlighting() {
        if (typeof hljs === 'undefined') return;

        const codeNodes = contentArea.querySelectorAll('pre code');
        codeNodes.forEach((code) => {
            try {
                hljs.highlightElement(code);
            } catch (e) {
                // Ignore highlighting failures per-block.
            }
        });
    }

    /**
     * Add copy buttons to all code blocks
     */
    function addCopyButtons() {
        const codeBlocks = contentArea.querySelectorAll('pre');
        
        codeBlocks.forEach(pre => {
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            // Get language from code element class
            const code = pre.querySelector('code');
            let language = 'plaintext';
            if (code) {
                const classMatch = (code.className || '').match(/language-([A-Za-z0-9_-]+)/);
                if (classMatch) {
                    language = classMatch[1];
                } else if (code.result && code.result.language) {
                    // highlightElement stores the auto-detected language on `code.result`.
                    language = code.result.language;
                } else if (typeof hljs !== 'undefined') {
                    // Fallback auto-detect for label only.
                    const result = hljs.highlightAuto(code.textContent);
                    language = result.language || 'plaintext';
                }
            }
            
            // Create header with language label and copy button
            const header = document.createElement('div');
            header.className = 'code-block-header';
            header.innerHTML = `
                <span class="code-language">${language.toUpperCase()}</span>
                <button class="copy-btn" title="Copy code">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span>Copy</span>
                </button>
            `;
            
            // Insert wrapper
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);
            
            // Add click handler for copy button
            const copyBtn = header.querySelector('.copy-btn');
            copyBtn.addEventListener('click', async () => {
                const codeText = code ? code.textContent : pre.textContent;
                try {
                    await navigator.clipboard.writeText(codeText);
                    copyBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"/>
                        </svg>
                        <span>Copied!</span>
                    `;
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            <span>Copy</span>
                        `;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        });
    }

    /**
     * Convert markdown to HTML using marked.js
     */
    function markdownToHtml(markdown) {
        // Configure marked options
        marked.setOptions({
            gfm: true,           // GitHub Flavored Markdown
            breaks: true         // Convert \n to <br>
        });

        return marked.parse(markdown);
    }

    /**
     * Event Listeners
     */
    sectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sectionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSection = btn.dataset.section;
            loadStructure();
        });
    });

    // Delegate click events for navigation
    docsNav.addEventListener('click', async (e) => {
        const fileBtn = e.target.closest('.nav-file');
        const folderBtn = e.target.closest('.nav-folder-toggle');

        if (fileBtn) {
            e.preventDefault();
            // Remove active from all files
            docsNav.querySelectorAll('.nav-file').forEach(f => f.classList.remove('active'));
            // Set this file as active
            fileBtn.classList.add('active');
            
            const path = fileBtn.dataset.path;
            await loadDocument(path);
        } else if (folderBtn) {
            e.preventDefault();
            const folder = folderBtn.closest('.nav-folder');
            folder.classList.toggle('open');
        }
    });

    // Initialize
    loadStructure();
})();
