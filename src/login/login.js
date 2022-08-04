function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    window.electronAPI.login(username, password);
    
    window.location.assign("../confirm_password/confirm_password.html");
}

document.getElementById("loginbtn").onclick = login;

document.getElementById("password").addEventListener('keyup', (event) => {
    // Validate the entire form to see if we should enable the `Submit` button.
    document.getElementById('loginbtn').disabled = !document.getElementById("password").checkValidity();
});