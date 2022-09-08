const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {

    // Main to renderer
    displayFile: (content, title) => ipcRenderer.on('displayFile', content, title), // Displays file content in renderer // fileManagement.js to notepad.js
    encryptContent: (nothing = "") => ipcRenderer.on('encryptContent', nothing), // Displays file content in renderer // fileManagement.js to notepad.js

    // Renderer to main
    login: (username, password) => ipcRenderer.send('login', username, password), // Stores uername and password in main process // login.js
    confirmPassword: (password2) => ipcRenderer.send('confirmPassword', password2),// Checks if password is correct // confirm_password.js
    openFile: (path) => ipcRenderer.send('openFile', path), // Opens file // notepad.js
    encryptFile: (content, title) => ipcRenderer.send('encryptFile', content, title), // Saves file // notepad.js
    resetPassword: () =>ipcRenderer.send('resetPassword') // reset password // notepad.js
});