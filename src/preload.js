const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    login: (username, password) => ipcRenderer.send('login', username, password),
    confirmPassword : (password2) => ipcRenderer.send('confirmPassword', password2),
})  
//Login

// let username;
// let password;
// let loginbtn;

// window.onload = function () {
//     username = document.getElementById('username');
//     password = document.getElementById('password');
//     loginbtn = document.getElementById('loginbtn');

//     loginbtn.onclick = function () {
//         const obj = { username: username.value, password: password.value };
//         console.log(obj);

//         window.location.assign("../confirm_password/confirm_password.html");
//     }
// }

// // function login() {
// //     const username = document.getElementById('username');
// //     const password = document.getElementById('password');

// //     console.log("test");
// //     console.log(username.value, password.value);

// //     window.location.assign("../confirm_password/confirm_password.html");
// // }

// // document.getElementById("loginbtn").onclick = function () {
// //     login();
// // };
