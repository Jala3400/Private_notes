// Regular expression to get the string between brackets /[^{\}]+(?=})/g
// return content.match(/[^{\}]+(?=})/g);
//* ============================== Format ==============================

function formatFile(content) { // Formats the file separating the configuration from the notes
    return JSON.stringify(content);
}

//* ============================== Deformats ==============================

function deformatFile(content) { // Decomposes the file on configuration and  notes
    return JSON.parse(content)
}

module.exports = { formatFile, deformatFile }