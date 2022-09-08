const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron')
const path = require('path')
const { FileManagement } = require('./scripts/fileManagement');
const CryptoJS = require('crypto-js');

//* ============================== Main Process ==============================

let mainWindow;
const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        // minWidth: 300,
        height: 600,
        // minHeight: 450,
        show: false,
        // titleBarStyle: 'hidden',
        // titleBarOverlay: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('src/login/login.html');
    mainWindow.once('ready-to-show', () => {
        // Shows the window once the content is loaded'
        mainWindow.show()
    })
}
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    //* Communication between renderer and main

    ipcMain.on('login', login);
    ipcMain.on('confirmPassword', confirmPassword);
    ipcMain.on('openFile', tempOpenFile);
    ipcMain.on('encryptFile', tempEncryptFile);
    ipcMain.on('resetPassword', relaunchApp)
})

// Functions used to fix an UnhandledPromiseRejectionWarning error with ipcMain.on
// They are caused because the file management doesn't start until logged in

function tempOpenFile(event, path) {
    // Intermediate function to open file
    fm.openFile(event, path);
}

function tempEncryptFile(event, content, title) {
    fm.encryptFile(event, content, title);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//* ============================== Menu ==============================

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
                label: 'Reset password',
                accelerator: 'CmdOrCtrl+Shift+Alt+R',
                click: () => { relaunchApp() },
            },
            { type: 'separator' },
            {
                label: "Open File",
                accelerator: 'CmdOrCtrl+O',
                click: function () {
                    if (metapassword) {
                        fm.openFile();
                    }
                    else
                        dialog.showMessageBox(mainWindow, {
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
                        mainWindow.webContents.send('encryptContent')
                    }
                    else
                        dialog.showMessageBox(mainWindow, {
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


//* ============================== Login ==============================

let username;
let password;

function login(event, name, pass) {
    // Assigns variables for the username and password
    username = name;
    password = pass;
}

function confirmPassword(event, password2) {
    // Checks if the password is correct ? create metapassword : go back
    if (password2 === password) {
        createMetapassword();
        mainWindow.loadFile("src/notepad/notepad.html");
    } else {

        dialog.showMessageBox(mainWindow, {
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
    // Creates a metapassword using the hash of the username and password
    // This creates a completely random password
    let hashedUsername = CryptoJS.SHA3(username).toString();
    let hashedPassword = CryptoJS.SHA3(password).toString();
    metapassword = CryptoJS.SHA3(hashedUsername + '#' + hashedPassword).toString();

    // Initiates file management
    fm = new FileManagement(mainWindow, metapassword);
}

//* ============================== Relaunch app ==============================

function relaunchApp() {
    if (
        dialog.showMessageBoxSync(this._mainWindow, { // Asks the user if he wants to relaunch the app
            title: 'Relaunch app',
            type: 'warning',
            message: 'The app will reset.',
            buttons: ["Continue", "Cancel"],
        }) === 0) {
        app.relaunch();
        app.exit();
    }
}