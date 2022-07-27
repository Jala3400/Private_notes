function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    window.electronAPI.login(username, password);
    
    window.location.assign("../confirm_password/confirm_password.html");
}

document.getElementById("loginbtn").onclick = login;