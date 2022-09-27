const currentVersion = 1.1;
var config = { noteVersion: currentVersion, publicTitle: "Random notes", privateTitle: "New notepad", description: "Secret notes" } // Creates the ddictionary where the configuration is going to be stored
var notes = [{ title: "New note", content: "" }]; // Creates the ddictionary where the notes are going to be stored
var content = { fileConfig: config, fileNotes: notes }

const noteTabsContainer = document.getElementById("note-tabs-container");

const notepadTitleInput = document.getElementById("notepad-title-input");

const titleInput = document.getElementById("title-input");
const noteInput = document.getElementById("note-input");

const configPublicTitleInput = document.getElementById("config-public-title-input");
const configPrivateTitleInput = document.getElementById("config-private-title-input");
const configDescriptionInput = document.getElementById("config-description-input");




//* ============================== File management ==============================

//* Open file
window.electronAPI.displayFile((_event, newContent) => { // Displays the content of the file on the textarea..
    // called by main process
    var newConfig = newContent.fileConfig;
    var newNotes = newContent.fileNotes;
    applyConfig(newConfig);
    displayNotes(newNotes);
});

function openFile(path = "") {
    // called by render process
    window.electronAPI.openFile(path);
}

function displayNotes(newNotes) { // Displays the content of a file
    noteTabsContainer.innerHTML = "";
    notes = newNotes;

    for (var i = 0; i < notes.length; i++) {
        displayNote(notes[i]);
    }
    changeNote(noteTabsContainer.firstChild);
    updateCounter();
}

function applyConfig(newConfig) {
    config = newConfig;
    notepadTitleInput.value = config.privateTitle;
    configPrivateTitleInput.value = config.privateTitle;
    configPublicTitleInput.value = config.publicTitle;
    configDescriptionInput.value = config.description;
}

document.getElementById("openFile").addEventListener("click", () => openFile(""));

//* Save file
window.electronAPI.encryptContent((_event) => { // Saves the content of the textarea
    // called by the main process
    encryptFile()
});

function encryptFile() { // called by render process
    // Saves the content of the note
    saveCurrentNote();
    config.noteVersion = currentVersion;
    config.privateTitle = notepadTitleInput.value;
    content = { fileConfig: config, fileNotes: notes }
    window.electronAPI.encryptFile(content);
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
        saveCurrentNote();

        let selectedNote = document.getElementsByClassName("note-tab selected")[0];
        if (selectedNote) {
            selectedNote.className = selectedNote.className.replace(" selected", "");
        }

        target.className += " selected"; // Adds the "selected" class to the clicked note tab
        var index = Array.from(noteTabsContainer.children).indexOf(target);
        titleInput.value = notes[index].title;
        noteInput.value = notes[index].content;
    }
}

// Temp save note
// titleInput.addEventListener("input", saveNote)
// noteInput.addEventListener("input", saveNote)

function saveCurrentNote() {
    let title = titleInput.value;
    let content = noteInput.value;

    let selectedNote = document.getElementsByClassName("note-tab selected")[0];
    let index = Array.from(noteTabsContainer.children).indexOf(selectedNote);
    notes[index] = { title: title, content: content };
}

// Update title

titleInput.addEventListener("input", updateTitle);

function updateTitle() {
    document.getElementsByClassName("note-tab selected")[0].getElementsByClassName("note-title")[0].innerText = titleInput.value;
}

//* ============================== Add note ==============================

document.getElementById("add-note").addEventListener("click", addNote);

function addNote(event, note = { title: "New note", content: "" }) { // Adds a note
    notes.push(note);
    displayNote(note);
}

function displayNote(note) { // Displays a note
    let title = note.title
    let newNote = createNote();

    let noteTitle = createNoteTitle(title);
    newNote.appendChild(noteTitle);

    let deleteButton = createDeleteButton();
    newNote.appendChild(deleteButton);

    noteTabsContainer.appendChild(newNote); // Appends the note to the note tabs panel
    changeNote(newNote); // Focuses the new note
    updateCounter(); // Updates the note counter
}

function createNote() {
    let newNote = document.createElement("div"); // Creates a new note tab
    newNote.className = "note-tab";
    newNote.addEventListener("click", (e) => changeNote(e.target));
    newNote.setAttribute("draggable", "true");
    newNote.addEventListener('dragstart', onDragStart);
    newNote.addEventListener('drop', onDrop);
    return newNote;
}

function createNoteTitle(title) {
    let noteTitle = document.createElement("p"); // Creates the title of the note
    noteTitle.className = "note-title";
    noteTitle.innerHTML = title;
    return noteTitle;
}

function createDeleteButton() {
    let deleteButton = document.createElement("button"); // Creates a button to delete the note
    deleteButton.innerHTML = "X";
    deleteButton.className = "delete-note";
    deleteButton.addEventListener("click", deleteNote);
    // let confirmDeletePopup = createDeleteConfirm()
    // deleteButton.appendChild(confirmDeletePopup);
    return deleteButton;
}

// function createDeleteConfirm() {
//     let confirmDeletePopup = document.createElement("span");
//     let confirmDeleteButton = document.createElement("button");
//     let cancelButton = document.createElement("button");

//     confirmDeletePopup.className = "popuptext"

//     confirmDeleteButton.className = "delete-note";
//     confirmDeleteButton.innerHTML = "Delete";
//     confirmDeleteButton.addEventListener("click", confirmDelete);

//     cancelButton.className = "cancel-button";
//     cancelButton.innerHTML = "Cancel";
//     cancelButton.addEventListener('click', deleteNote)

//     confirmDeletePopup.appendChild(confirmDeleteButton);
//     confirmDeletePopup.appendChild(cancelButton);

//     return confirmDeletePopup;
// }

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

const deleteNoteModalbg = document.getElementById("delete-note-modal");
var noteToDelete;

function deleteNote(event) {
    deleteNoteModalbg.className += " show"
    noteToDelete = event.target.parentNode
}

document.getElementById("confirm-delete-button").addEventListener("click", confirmDelete);

function confirmDelete(event) {
    closeDelete();
    let nextTab = noteToDelete.nextElementSibling;
    let previousTab = noteToDelete.previousElementSibling;
    let index = Array.from(noteTabsContainer.children).indexOf(noteToDelete);
    notes.splice(index, 1);
    noteTabsContainer.removeChild(noteToDelete);
    updateCounter();

    let change = document.getElementsByClassName("note-tab selected")[0] ? false : true;

    if (change && nextTab) changeNote(nextTab);
    else if (change && previousTab) changeNote(previousTab);
    else {
        titleInput.value = "";
        noteInput.value = "";
    }
}

document.getElementById("cancel-delete-button").addEventListener("click", closeDelete);
document.getElementById("delete-note-cancelbg").addEventListener("click", closeDelete);

function closeDelete() {
    deleteNoteModalbg.className = deleteNoteModalbg.className.replace(" show", "");
}

//* ============================== Config ==============================

document.getElementById("open-config-button").addEventListener("click", openConfig);

const configModalbg = document.getElementById("config-modalbg");

function openConfig(event) {
    configModalbg.className += " show"
}

document.getElementById("save-config-button").addEventListener("click", saveConfig);

function saveConfig(_event) {
    let newPublicTitle = configPublicTitleInput.value;
    let newPrivateTitle = configPrivateTitleInput.value;
    let newDescription = configDescriptionInput.value;

    let newConfig = { noteVersion: currentVersion, publicTitle: newPublicTitle, privateTitle: newPrivateTitle, description: newDescription }

    applyConfig(newConfig);
    closeConfig();
}

// Notepad title 
notepadTitleInput.addEventListener("input", updateConfigTitle);

function updateConfigTitle() {
    configPrivateTitleInput.value = notepadTitleInput.value;
}

configPrivateTitleInput.addEventListener("input", updateNotepadTitle);

function updateNotepadTitle() {
    notepadTitleInput.value = configPrivateTitleInput.value;
}

document.getElementById("close-config-button").addEventListener("click", closeConfig);
document.getElementById("config-cancelbg").addEventListener("click", closeConfig);

function closeConfig() {
    configModalbg.className = configModalbg.className.replace(" show", "");
}

//* ============================== Drag and drop notes ==============================

function onDragStart(event) {
    let note = event.target
    let index = Array.from(noteTabsContainer.children).indexOf(note);
    saveCurrentNote();
    event.dataTransfer.setData("note", note);
    event.dataTransfer.setData("index", index);
}

function onDrop(event) {
    event.preventDefault();
    if (event.target.className.indexOf("note-tab") || event.target.parentNode.className.indexOf("note-tab")) {
        let target = (event.target.className.indexOf("note-tab") ? event.target.parentNode : event.target);

        let draggedNoteIndex = event.dataTransfer.getData("index");
        let targetIndex = Array.from(noteTabsContainer.children).indexOf(target);
        let draggedNote = notes[draggedNoteIndex];

        notes.splice(draggedNoteIndex, 1);
        notes.splice(targetIndex, 0, draggedNote);

        displayNotes(notes);
        changeNote(noteTabsContainer.children[targetIndex]);
    }
}

//* ============================== Drag and drop files ==============================

const dragAndDrop = document.getElementById("drag-and-drop");

window.addEventListener('drop', (event) => { // When a file is dropped
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.items[0].kind === 'file') { // Checks if the file is a file

        if (event.dataTransfer.files.length == 1) {
            const path = event.dataTransfer.files[0].path;
            openFile(path);
        } else alert("Only one file can be dragged");
    }

    dragAndDrop.style.opacity = 0;
    dragAndDrop.style.zIndex = -1;
});

window.addEventListener('dragover', (event) => { // When a file is being dragged
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items[0].kind === 'file') {
        dragAndDrop.style.opacity = 0.5;
        dragAndDrop.style.zIndex = 1;
    }
});

window.addEventListener('dragleave', (event) => { // When a file leaves the window
    event.preventDefault();
    event.stopPropagation();
    dragAndDrop.style.opacity = 0;
    dragAndDrop.style.zIndex = -1;
});
