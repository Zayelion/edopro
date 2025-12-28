const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  exitApp: () => ipcRenderer.send('app:exit')
});
