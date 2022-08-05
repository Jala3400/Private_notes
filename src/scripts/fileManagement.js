const { dialog } = require('electron');
const fs = require('fs');
const enc = require('../scripts/encrypter');

class FileManagement {

    constructor(mainWindow, metapassword) {
        this._mainWindow = mainWindow;
        this.metapassword = metapassword;
    }
    // Open Files
    openFile(event) {

        // Looking for markdown files
        const files = dialog.showOpenDialogSync(this._mainWindow, {
            filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt'] }],
            properties: ['openFile', 'dontAddToRecent'],
            // defaultPath: app.getPath('desktop')
        });

        // If no files exit
        if (files) {
            const file = files[0];
            const fileContent = fs.readFileSync(file).toString();
            const decryptedContent = enc.decrypt(fileContent, this.metapassword);
            this._mainWindow.webContents.send('displayFile', decryptedContent);
        }
        else return;
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

    async saveFile(event, content) {
        let filePath = dialog.showSaveDialogSync(this._mainWindow, {
            filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt'] }],
            properties: ['dontAddToRecent'],
            // defaultPath: app.getPath('desktop')
        })
        if (filePath) {
            const encyptedContent = enc.encrypt(content, this.metapassword);
            fs.writeFile(filePath,
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
