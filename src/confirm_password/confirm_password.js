function confirmPassword() {
    const password2 = document.getElementById('password').value;
    window.electronAPI.confirmPassword(password2);
}

function cancel() {
    window.location.assign("../login/login.html");
}

document.getElementById("loginbtn").onclick = confirmPassword;
document.getElementById("cancelbtn").onclick = cancel;

document.getElementById("password").addEventListener('keyup', (event) => {
    // Validate the entire form to see if we should enable the `Submit` button.
    document.getElementById('loginbtn').disabled = !document.getElementById("password").checkValidity();
});