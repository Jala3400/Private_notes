var notes = [{ title: "New note", content: "" }]; // Creates the dictionary where the notes are going to be stored

//* ============================== File management ==============================

//* Open file
window.electronAPI.displayFile((_event, newNotes, title) => { // Displays the content of the file on the textarea..
    // called by main process
    displayNotes(newNotes, title);
});

function openFile(path = "") {
    // called by render process
    window.electronAPI.openFile(path);
}

function displayNotes(newNotes, title) { // Displays the content of a file
    document.getElementById("note-tabs-container").innerHTML = "";
    notes = [];
    
    document.getElementById("notepad-title").value = title;
    for (note in newNotes) {
        console.log(note);
        addNote("", title = newNotes[note].title, newNotes[note].content);
        console.log(notes)
    }
    changeNote(document.getElementById("note-tabs-container").firstChild);
    updateCounter();
}

document.getElementById("openFile").addEventListener("click", () => openFile(""));

//* Save file
window.electronAPI.encryptContent((_event) => { // Saves the content of the textarea
    // called by the main process
    encryptFile()
});

function encryptFile() { // called by render process
    let noteTabs = document.getElementsByClassName("note-tab");
    for (var i = 0; i < noteTabs.length; i++) {
        if (noteTabs[i].className.includes("selected")) { // Saves the content of the note
            saveNote(i);
        }
    }
    window.electronAPI.encryptFile(notes, document.getElementById("notepad-title").value);
}

document.getElementById("encryptFile").addEventListener("click", encryptFile);

//* ============================== Tools bar ==============================

document.getElementById("reset-password-tool").addEventListener("click", window.electronAPI.resetPassword) //

//* ============================== Change note ==============================


var originalNoteTabs = document.getElementsByClassName("note-tab");
for (var i = 0; i < originalNoteTabs.length; i++) {
    originalNoteTabs[i].addEventListener("click", (e) => changeNote(e.target));
    originalNoteTabs[i].addEventListener('dragstart', onDragStart);
    originalNoteTabs[i].addEventListener('drop', onDrop);
}

function changeNote(target) { // Changes the note your are focused on
    if (target.className == "note-title") {
        target = target.parentNode
    }
    if (target.className == "note-tab") {
        let noteTabs = document.getElementsByClassName("note-tab");
        for (var i = 0; i < noteTabs.length; i++) {

            if (noteTabs[i].className.includes("selected")) { // Saves the content of the note
                saveNote(i);
            }
            noteTabs[i].className = noteTabs[i].className.replace(" selected", "");// Removes the "selected" class from all the tabs
        }
        target.className += " selected"; // Adds the "selected" class to the clicked note tab
        var index = Array.from(target.parentNode.children).indexOf(target);
        document.getElementById("title-input").value = notes[index].title;
        document.getElementById("note-input").value = notes[index].content;
    }
}

// Temp save note
// document.getElementById("title-input").addEventListener("input", saveNote)
// document.getElementById("note-input").addEventListener("input", saveNote)

function saveNote(i) {
    let title = document.getElementById("title-input").value;
    let content = document.getElementById("note-input").value;
    notes[i] = { title: title, content: content };
}

// Update title

document.getElementById("title-input").addEventListener("input", updateTitle);

function updateTitle() {
    document.getElementsByClassName("note-tab selected")[0].getElementsByClassName("note-title")[0].innerText = document.getElementById("title-input").value;
}

//* ============================== Add note ==============================

document.getElementById("add-note").addEventListener("click", addNote);

function addNote(event, title = "New note", content = "") { // Adds a note
    let newNote = document.createElement("div"); // Creates a new note tab
    newNote.className = "note-tab";
    newNote.addEventListener("click", (e) => changeNote(e.target));
    newNote.setAttribute("draggable", "true");
    newNote.addEventListener('dragstart', onDragStart);
    newNote.addEventListener('drop', onDrop);

    let noteTitle = document.createElement("p"); // Creates the title of the note
    noteTitle.className = "note-title";
    noteTitle.innerHTML = title;
    newNote.appendChild(noteTitle);

    let deleteButton = document.createElement("button"); // Creates a button to delete the note
    deleteButton.innerHTML = "X";
    deleteButton.className = "delete-note";
    deleteButton.addEventListener("click", deleteNote);
    newNote.appendChild(deleteButton);

    document.getElementById("note-tabs-container").appendChild(newNote); // Appends the note to the note tabs panel
    notes.push({ title: title, content: content });
    changeNote(newNote); // Focuses the new note
    // document.getElementById("title-input").value = title // Updates the title input
    updateCounter(); // Updates the note counter
}

// Update note counter

function updateCounter() {
    let noteTabs = document.getElementsByClassName("note-tab")
    document.getElementById("note-counter").innerHTML = noteTabs.length + (noteTabs.length == 1 ? " note" : " notes");
}

//* ============================== Delete notes ==============================

let deleteButtons = document.getElementsByClassName("delete-note");
for (var i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", deleteNote);
}

function deleteNote(event) {
    var btn = event.target;
    let previous = btn.parentNode.previousElementSibling;
    var tab = btn.parentNode;
    var index = Array.from(tab.parentNode.children).indexOf(tab);
    notes.splice(index, 1);
    btn.parentNode.parentNode.removeChild(btn.parentNode);
    updateCounter();

    let noteTabs = document.getElementsByClassName("note-tab");
    let change = true;
    for (var i = 0; i < noteTabs.length; i++) { // Changes note if the deleted note was focused
        if (noteTabs[i].className.includes("selected")) {
            change = false;
            break
        }
    }
    if (change && previous) {
        changeNote(previous);
    }
}

//* ============================== Drag and drop notes ==============================

function onDragStart(event) {
    // event.preventDefault();
    // console.log("dragstart");
    // console.log(notes);
    // console.log(event);
    // console.log(event.dataTransfer);
    saveNote(Array.from(event.target.parentNode.children).indexOf(event.target));
    let index = Array.from(event.target.parentNode.children).indexOf(event.target);
    event.dataTransfer.setData("index", index);
}

function onDrop(event) {
    // event.preventDefault();
    // let draggedTabIndex = event.dataTransfer.getData("index");

    // console.log("ondrop");
    // console.log(notes);
    // console.log(draggedTabIndex);
    // console.log(event.target);
    // let targetIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    // console.log(targetIndex);

    // let draggedNote = notes[draggedTabIndex];
    // console.log(draggedNote);

    // console.log(notes);
    // notes.splice(draggedTabIndex, 1);
    // console.log(notes);

    // notes.splice(targetIndex, 0, draggedNote);

    // console.log(notes);
    // displayNotes();
    // console.log(notes);
    // displayNotes();

    // changeNote(document.getElementById("note-tabs-container").firstChild);
    // console.log(notes);

    // console.log("dragend");
}

//* ============================== Drag and drop files ==============================

window.addEventListener('drop', (event) => { // When a file is dropped
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.items[0].kind === 'file') { // Checks if the file is a file

        if (event.dataTransfer.files.length == 1) {
            const path = event.dataTransfer.files[0].path;
            openFile(path);
        } else alert("Only one file can be dragged");
    }

    document.getElementById("drag-and-drop").style.opacity = 0;
    document.getElementById("drag-and-drop").style.zIndex = -1;
});

window.addEventListener('dragover', (event) => { // When a file is being dragged
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items[0].kind === 'file') {
        document.getElementById("drag-and-drop").style.opacity = 0.5;
        document.getElementById("drag-and-drop").style.zIndex = 1;
    }
});

window.addEventListener('dragleave', (event) => { // When a file leaves the window
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("drag-and-drop").style.opacity = 0;
    document.getElementById("drag-and-drop").style.zIndex = -1;
});
