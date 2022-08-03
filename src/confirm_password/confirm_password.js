function confirmPassword() {
    const password2 = document.getElementById('password').value;
    window.electronAPI.confirmPassword(password2);
}

function cancel() {
    window.location.assign("../login/login.html");
}

document.getElementById("loginbtn").onclick = confirmPassword;
document.getElementById("cancelbtn").onclick = cancel;