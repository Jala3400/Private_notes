//* Displays the content of the file on the textarea..

window.electronAPI.displayFile((_event, content) => {
    // called by main process
    document.getElementById("editor").value = content;
});

function openFile(path) {
    // called by render process
    window.electronAPI.openFile(path);
}

document.getElementById("openFile").onclick = openFile;

//* Saves the content of the textarea

window.electronAPI.encryptContent((_event) => {
    // called by the main process
    encryptFile()
});

function encryptFile() {
    // called by render process
    window.electronAPI.encryptFile(document.getElementById("editor").value);
}

document.getElementById("encryptFile").onclick = encryptFile;

//* Drag and drop files

window.addEventListener('drop', (event) => {
    // When a file is dropped
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.items[0].kind === 'file') {
        if (event.dataTransfer.files.length == 1) {
            const path = event.dataTransfer.files[0].path;
            openFile(path);
        } else alert("Only one file can be dragged");
    } else alert("Only files can be dragged");

    document.getElementById("drag-and-drop").style.opacity = 0;
    document.getElementById("drag-and-drop").style.zIndex = -1;
});

window.addEventListener('dragover', (event) => {
    // When a file is being dragged
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("drag-and-drop").style.opacity = 0.5;
    document.getElementById("drag-and-drop").style.zIndex = 1;
});

window.addEventListener('dragleave', (event) => {
    // When a file leaves the window
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("drag-and-drop").style.opacity = 0;
    document.getElementById("drag-and-drop").style.zIndex = -1;
});
