const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron')
const path = require('path')
const { FileManagement } = require('./scripts/fileManagement');
const CryptoJS = require('crypto-js');

let mainWindow;
const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // titleBarStyle: 'hidden',
        // titleBarOverlay: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('src/login/login.html');
}
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    // Communication between renderer and main

    ipcMain.on('login', login);
    ipcMain.on('confirmPassword', confirmPassword);
    ipcMain.on('openFile', tempOpenFile);
    ipcMain.on('saveFile', tempSaveFile);
})

// Functions used to fix an UnhandledPromiseRejectionWarning error with ipcMain.on

function tempOpenFile(event) {
    // Intermediate function to open file
    fm.openFile(event);
}

function tempSaveFile(event, content) {
    fm.saveFile(event, content);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' },
            {
                label: "Open File",
                accelerator: 'CmdOrCtrl+O',
                click: function () {
                    if (metapassword) {
                        fm.openFile();
                    }
                    else
                        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                            title: 'Error',
                            type: 'info',
                            message: `Login required`,
                        });
                },
            },
            {
                label: "Open Folder",
                click: function () {
                    if (metapassword) {
                        fm.openFolder();
                    }
                    else
                        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                            title: 'Error',
                            type: 'info',
                            message: `Login required`,
                        });
                },
            },
            {
                label: "Save File",
                accelerator: 'CmdOrCtrl+S',
                click: function () {
                    if (metapassword) {
                        mainWindow.webContents.send('saveContent')
                    }
                    else
                        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                            title: 'Error',
                            type: 'info',
                            message: `Login required`,
                        });
                },
            },
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Editar',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startSpeaking' },
                        { role: 'stopSpeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://electronjs.org');
                }
            }
        ]
    },
    {
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                click: function () {
                    mainWindow.webContents.openDevTools();
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// Login

let username;
let password;

function login(event, name, pass) {
    username = name;
    password = pass;
}

function confirmPassword(event, password2) {
    if (password2 === password) {
        createMetapassword();
        mainWindow.loadFile("src/notepad/notepad.html");
    } else {

        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: 'Error',
            type: 'info',
            message: `Wrong password`,
        });
        mainWindow.loadFile("src/login/login.html");
    }
}

let metapassword = null;
let fm;

function createMetapassword() {
    metapassword = CryptoJS.SHA3(username + '~' + password).toString();

    // Update file management
    fm = new FileManagement(mainWindow, metapassword);
}
// Initialize file management

// fm = new FileManagement(mainWindow, '');