const { dialog } = require('electron');
const fs = require('fs');
const enc = require('../scripts/encrypter');

class FileManagement {

    constructor(mainWindow, metapassword) {
        // Gets the mainwindow and the metapassword
        this._mainWindow = mainWindow;
        this.metapassword = metapassword;
    }
    //* Open a sigle file
    openFile(event, path = "") {

        //* If no path given, displays an open file dialog.
        if (!path) {
            // Looking for markdown files
            const paths = dialog.showOpenDialogSync(this._mainWindow, {
                filters: [{ name: 'Markdown', extensions: ['lock', 'md', 'txt', 'markdown'] }],
                properties: ['openFile', 'dontAddToRecent'],
                // defaultPath: app.getPath('desktop')
            });

            // If no files exit (in case the user cancels the selection)
            if (paths) {
                //* Gets the path of the selected file 
                path = paths[0];
            }
            else return;
        }

        //* Opens the file

        let fileContent = fs.readFileSync(path).toString(); // Gets the content of the file
        if (path.endsWith('.lock')) {
            // If file is a .lock file decrypts it
            fileContent = enc.decrypt(fileContent, this.metapassword);
        }
        if (fileContent) {
            // Displays the file
            this._mainWindow.webContents.send('displayFile', fileContent);
        } else {
            dialog.showMessageBox(this._mainWindow, {
                title: 'Encryption Error',
                type: 'error',
                message: 'This file is empty or the username and password are incorrect',
            })
        }
    }

    // Open Folder
    openFolder() {

        // // Looking for directories
        // const directory = dialog.showOpenDialogSync(this.mainWindow, {
        //     properties: ['openDirectory']
        // });

        // // If no files exit
        // if (directory) {
        //     console.log(directory);
        //     for (file in directory) {
        //         let fileContent = fs.readFileSync(file).toString();
        //         console.log(fileContent);
        //     }
        // } else return;
    }

    async encryptFile(event, content) {
        let path = dialog.showSaveDialogSync(this._mainWindow, {
            filters: [{ name: 'Markdown', extensions: ['lock', 'md', 'txt', 'markdown'] }],
            properties: ['dontAddToRecent'],
            // defaultPath: app.getPath('desktop')
        })
        if (path) {
            const encyptedContent = enc.encrypt(content, this.metapassword);
            fs.writeFile(path,
                encyptedContent, (err) => {
                    if (err) {
                        dialog.showMessageBox(this._mainWindow, {
                            title: 'Download Error',
                            type: 'error',
                            message: err.name || 'Error',
                            detail: err.toString()
                        });
                    }
                });
        }
    }
}

module.exports.FileManagement = FileManagement;
