// This script defines the Tab class, which manages a single tab and its webview.

class Tab {
  constructor(tabId, tabManager, url) {
    this.id = tabId;
    this.tabManager = tabManager; // Reference to the BrowserRenderer
    this.title = "New Tab";

    // Create tab UI element
    this.tabElement = document.createElement('div');
    this.tabElement.className = 'tab';
    this.tabElement.dataset.id = this.id;
    this.tabElement.innerHTML = `
      <span class="tab-title">New Tab</span>
      <button class="tab-close-btn"><i class="fas fa-times"></i></button>
    `;

    // Create webview element
    this.webview = document.createElement('webview');
    this.webview.className = 'webview';
    this.webview.dataset.id = this.id;
    // Use an explicit relative path for the homepage
    this.webview.src = (url === 'home.html' || url === './home.html') ? './home.html' : url;

    this.titleElement = this.tabElement.querySelector('.tab-title');

    this.setupListeners();
  }

  setupListeners() {
    // --- Tab UI Listeners ---
    this.tabElement.addEventListener('click', (e) => {
      if (e.target.closest('.tab-close-btn')) {
        this.tabManager.closeTab(this.id);
      } else {
        this.tabManager.switchToTab(this.id);
      }
    });

    // --- Webview Listeners ---
    this.webview.addEventListener('did-start-loading', () => {
      this.tabManager.updateNavState();
    });

    this.webview.addEventListener('did-stop-loading', () => {
      this.tabManager.updateNavState();
    });

    this.webview.addEventListener('did-navigate', (e) => {
      this.tabManager.onTabNavigate(this.id, e.url);
    });
    
    this.webview.addEventListener('did-navigate-in-page', (e) => {
      this.tabManager.onTabNavigate(this.id, e.url);
    });

    this.webview.addEventListener('page-title-updated', (e) => {
      this.title = e.title;
      this.titleElement.textContent = e.title;
      this.tabManager.onTabTitleUpdated(this.id, e.title);
    });
  }

  // --- Public Methods ---

  activate() {
    this.tabElement.classList.add('active');
    this.webview.classList.add('active');
  }

  deactivate() {
    this.tabElement.classList.remove('active');
    this.webview.classList.remove('active');
  }

  navigateTo(url) {
    this.webview.loadURL(url);
  }

  goBack() {
    if (this.webview.canGoBack()) {
      this.webview.goBack();
    }
  }

  goForward() {
    if (this.webview.canGoForward()) {
      this.webview.goForward();
    }
  }

  reload() {
    this.webview.reload();
  }

  close() {
    // Remove elements from DOM
    this.tabElement.remove();
    this.webview.remove();
  }
}
