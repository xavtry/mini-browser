class BrowserRenderer {
  constructor() {
    this.tabs = new Map();
    this.activeTabId = null;

    this.initDOM();
    this.initListeners();
    this.createNewTab(); // Start with one new tab
  }

  // Find all necessary DOM elements
  initDOM() {
    this.tabBar = document.getElementById('tab-bar');
    this.newTabBtn = document.getElementById('new-tab-btn');
    this.backBtn = document.getElementById('back-btn');
    this.fwdBtn = document.getElementById('fwd-btn');
    this.reloadBtn = document.getElementById('reload-btn');
    this.urlInput = document.getElementById('url-input');
    this.webviewContainer = document.getElementById('webview-container');
  }

  // Set up all event listeners
  initListeners() {
    this.newTabBtn.addEventListener('click', () => this.createNewTab());
    this.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.navigateTo(this.urlInput.value);
    });
    this.backBtn.addEventListener('click', () => this.getActiveWebview()?.goBack());
    this.fwdBtn.addEventListener('click', () => this.getActiveWebview()?.goForward());
    this.reloadBtn.addEventListener('click', () => this.getActiveWebview()?.reload());

    // Listen for shortcuts from the main process
    window.electronAPI.onNewTab(() => this.createNewTab());
    window.electronAPI.onCloseTab(() => this.closeActiveTab());
    window.electronAPI.onFocusURL(() => this.urlInput.focus());
  }

  // --- Tab Management ---

  createNewTab(url = 'home.html') {
    const tabId = `tab-${Date.now()}`;
    
    // 1. Create the tab UI element
    const tabElement = document.createElement('div');
    tabElement.className = 'tab';
    tabElement.dataset.id = tabId;
    tabElement.innerHTML = `
      <span class="tab-title">New Tab</span>
      <button class="tab-close-btn"><i class="fas fa-times"></i></button>
    `;
    this.tabBar.appendChild(tabElement);

    // 2. Create the webview
    const webview = document.createElement('webview');
    webview.className = 'webview';
    webview.dataset.id = tabId;
    webview.src = url;
    this.webviewContainer.appendChild(webview);

    // 3. Store tab data
    this.tabs.set(tabId, { tabElement, webview });

    // 4. Add webview event listeners
    this.setupWebviewListeners(tabId, webview);

    // 5. Add tab UI listeners
    tabElement.addEventListener('click', (e) => {
      if (e.target.closest('.tab-close-btn')) {
        this.closeTab(tabId);
      } else {
        this.switchToTab(tabId);
      }
    });

    this.switchToTab(tabId);
  }

  closeActiveTab() {
    if (this.activeTabId) {
      this.closeTab(this.activeTabId);
    }
  }

  closeTab(tabId) {
    const tabData = this.tabs.get(tabId);
    if (!tabData) return;

    // Remove elements from DOM
    tabData.tabElement.remove();
    tabData.webview.remove();

    // Remove from our map
    this.tabs.delete(tabId);

    // If we closed the active tab, switch to another one
    if (this.activeTabId === tabId) {
      // Get the last tab in the list, or null if no tabs left
      const lastTab = Array.from(this.tabs.keys()).pop();
      if (lastTab) {
        this.switchToTab(lastTab);
      } else {
        // If no tabs are left, create a new one
        this.createNewTab();
      }
    }
  }

  switchToTab(tabId) {
    if (!this.tabs.has(tabId)) return;
    this.activeTabId = tabId;

    // 1. Deactivate all tabs and webviews
    this.tabs.forEach((data) => {
      data.tabElement.classList.remove('active');
      data.webview.classList.remove('active');
    });

    // 2. Activate the selected one
    const tabData = this.tabs.get(tabId);
    tabData.tabElement.classList.add('active');
    tabData.webview.classList.add('active');

    // 3. Update nav state for the new active tab
    this.updateNavState();
    this.urlInput.value = tabData.webview.src === 'home.html' ? '' : tabData.webview.getURL();
    
    // 4. Update window title
    const title = tabData.webview.getTitle() || 'New Tab';
    window.electronAPI.setTitle(title);
  }

  // --- Webview Event Listeners ---

  setupWebviewListeners(tabId, webview) {
    // When page starts loading
    webview.addEventListener('did-start-loading', () => {
      this.updateNavState();
    });

    // When page finishes loading
    webview.addEventListener('did-stop-loading', () => {
      this.updateNavState();
    });

    // When navigation happens in the page
    webview.addEventListener('did-navigate', (e) => {
      if (this.activeTabId === tabId) {
        this.urlInput.value = e.url;
        this.updateNavState();
      }
    });

    // When the page title is updated
    webview.addEventListener('page-title-updated', (e) => {
      const tabData = this.tabs.get(tabId);
      if (tabData) {
        tabData.tabElement.querySelector('.tab-title').textContent = e.title;
      }
      if (this.activeTabId === tabId) {
        window.electronAPI.setTitle(e.title);
      }
    });
  }

  // --- Navigation ---

  navigateTo(url) {
    const webview = this.getActiveWebview();
    if (!webview) return;

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        // Assume it's a domain
        finalUrl = `https://${url}`;
      } else {
        // Assume it's a search
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    webview.loadURL(finalUrl);
  }

  // --- Helpers ---

  getActiveWebview() {
    if (!this.activeTabId) return null;
    return this.tabs.get(this.activeTabId)?.webview;
  }

  updateNavState() {
    const webview = this.getActiveWebview();
    if (!webview) {
      this.backBtn.disabled = true;
      this.fwdBtn.disabled = true;
      this.reloadBtn.disabled = true;
      return;
    }

    this.backBtn.disabled = !webview.canGoBack();
    this.fwdBtn.disabled = !webview.canGoForward();
    this.reloadBtn.disabled = false; // Can always reload
  }
}

// Initialize the browser UI
new BrowserRenderer();
