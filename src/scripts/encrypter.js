const CryptoJS = require('crypto-js');

function encrypt(content, password) {
    const ciphertext = CryptoJS.AES.encrypt(content, password).toString();
    return ciphertext;
}

function decrypt(content, password) {
    const bytes = CryptoJS.AES.decrypt(content, password);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt }