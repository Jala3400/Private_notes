// Regular expression to get the string between brackets /[^{\}]+(?=})/g
const enc = require('./encrypter');

// //* ============================== Format ==============================

// function formatFile(config, content, password) { // Formats the file separating the configuration from the notes
//     return '{Config: ' + enc.encrypt(config, password) + '}' + '{Notes: ' + enc.encrypt(content, password) + '}';
// }

function formatNote(content) {
    return JSON.stringify(content);
}

// //* ============================== Deformats ==============================

// function deformatFile(content) { // Decomposes the file on configuration and  notes
//     return content.match(/[^{\}]+(?=})/g);
// }

function deFormatNote(content) {
    return JSON.parse(content);
}

module.exports = { formatNote, deFormatNote }