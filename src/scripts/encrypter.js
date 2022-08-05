const CryptoJS = require('crypto-js');

function encrypt(text, password) {
    const ciphertext = CryptoJS.AES.encrypt(text, password).toString();
    return ciphertext;
}

function decrypt(text, password) {
    const bytes = CryptoJS.AES.decrypt(text, password);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt }