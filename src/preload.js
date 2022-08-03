const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {

    // Main to renderer
    displayFile: (content) => ipcRenderer.on('displayFile', content), // Displays file content in renderer
    saveContent: (nothing = "") => ipcRenderer.on('saveContent', nothing), // Displays file content in renderer

    // Renderer to main
    login: (username, password) => ipcRenderer.send('login', username, password), // Stores uername and password in main process
    confirmPassword: (password2) => ipcRenderer.send('confirmPassword', password2),// Checks if password is correct
    openFile: () => ipcRenderer.send('openFile'), // Opens file
    saveFile: (content) => ipcRenderer.send('saveFile', content), // Saves file
});