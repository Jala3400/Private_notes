
//Displays the content of the file on the textarea..

window.electronAPI.displayFile((_event, content) => {
    // called by main process
    document.getElementById("editor").value = content;
});

function openFile() {
    // called by render process
    window.electronAPI.openFile();
}

document.getElementById("openFile").onclick = openFile;

// Saves the content of the textarea

window.electronAPI.saveContent((_event) => {
    // called by the main process
    saveFile()
});

function saveFile() {
    // called by render process
    window.electronAPI.saveFile(document.getElementById("editor").value);
}

document.getElementById("saveFile").onclick = saveFile;