const { dialog } = require('electron');
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const enc = require('./encrypter');
const formatter = require('./formatter');

class FileManagement {

    constructor(mainWindow, metapassword) {
        // Gets the mainwindow and the metapassword
        this._mainWindow = mainWindow;
        this.metapassword = metapassword;
    }
    //* Open a sigle file
    openFile(event, filePath = "") {

        if (!filePath) { //* If no path given, displays an open file dialog.
            const paths = dialog.showOpenDialogSync(this._mainWindow, { // Looks for lockd files
                filters: [{ name: 'Locked', extensions: ['lockd'] }],
                properties: ['openFile', 'dontAddToRecent'],
                defaultPath: app.getPath('desktop')
            });

            if (paths) { // If no files exit (in case the user cancels the selection)
                //* Gets the path of the selected file 
                filePath = paths[0];
            }
            else return;
        }

        //* Opens the file
        let fileContent

        try {
            fileContent = fs.readFileSync(filePath).toString(); // Gets the content of the file
        }
        catch (err) {
            dialog.showMessageBox(this._mainWindow, {
                title: "Folders aren't supported",
                type: 'error',
                message: err.name || 'Error',
                detail: err.toString()
            });
            return
        }

        try {
            fileContent = enc.decrypt(fileContent, this.metapassword);
            var deFormattedContent = formatter.deformatFile(fileContent);
        } catch (err) {
            dialog.showMessageBox(this._mainWindow, {
                title: 'Encryption Error',
                type: 'error',
                message: 'The username and/or password are incorrect',
                detail: err.toString()
            })
        }

        if (fileContent) { // Displays the file
            try {
                let fileTitle = path.parse(filePath).name;
                deFormattedContent.fileConfig.publicTitle = fileTitle;
                this._mainWindow.webContents.send('displayFile', deFormattedContent);
            }
            catch (err) {
                dialog.showMessageBox(this._mainWindow, {
                    title: 'Formatting error',
                    type: 'error',
                    message: 'The notes might be from a different version',
                    detail: err.toString()
                })
            }
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
        let path = dialog.showSaveDialogSync(this._mainWindow, { // Looks for a place to store the file
            filters: [{ name: 'Locked', extensions: ['lockd'] }],
            properties: ['dontAddToRecent'],
            defaultPath: app.getPath('desktop') + '\\' + content.fileConfig.publicTitle,
        })
        if (path) { // Saves the file
            const formattedContent = formatter.formatFile(content);
            const encyptedContent = enc.encrypt(formattedContent, this.metapassword);
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
