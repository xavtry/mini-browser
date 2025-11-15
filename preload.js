const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Renderer to Main (Send)
  setTitle: (title) => {
    ipcRenderer.send('set-title', title);
  },

  // Main to Renderer (Listen)
  onNewTab: (callback) => {
    ipcRenderer.on('shortcut-new-tab', (event, ...args) => callback(...args));
  },
  onCloseTab: (callback) => {
    ipcRenderer.on('shortcut-close-tab', (event, ...args) => callback(...args));
  },
  onFocusURL: (callback) => {
    ipcRenderer.on('shortcut-focus-url', (event, ...args) => callback(...args));
  },
});
