const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Mini Browser',
    backgroundColor: '#1e1e1e', // Dark background color
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // The webview tag is required for this browser to function.
      // It is enabled by default in Electron, but `nodeIntegration`
      // and `contextIsolation` are set for security.
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Enable the <webview> tag
    },
  });

  // Load the main browser UI (the "chrome")
  mainWindow.loadFile('browser/index.html');

  // Register global keyboard shortcuts
  // We send events to the renderer process to handle these.
  globalShortcut.register('CommandOrControl+T', () => {
    mainWindow.webContents.send('shortcut-new-tab');
  });

  globalShortcut.register('CommandOrControl+W', () => {
    mainWindow.webContents.send('shortcut-close-tab');
  });

  globalShortcut.register('CommandOrControl+L', () => {
    mainWindow.webContents.send('shortcut-focus-url');
  });

  // Listen for title updates from tabs
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (win) {
      win.setTitle(`Mini Browser - ${title}`);
    }
  });

  // Open DevTools - useful for debugging
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts on exit
  globalShortcut.unregisterAll();
});
