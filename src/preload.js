const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {

    // Main to renderer
    displayFile: (content) => ipcRenderer.on('displayFile', content), // Displays file content in renderer
    encryptContent: (nothing = "") => ipcRenderer.on('encryptContent', nothing), // Displays file content in renderer

    // Renderer to main
    login: (username, password) => ipcRenderer.send('login', username, password), // Stores uername and password in main process
    confirmPassword: (password2) => ipcRenderer.send('confirmPassword', password2),// Checks if password is correct
    openFile: (path) => ipcRenderer.send('openFile', path), // Opens file
    encryptFile: (content) => ipcRenderer.send('encryptFile', content), // Saves file
});