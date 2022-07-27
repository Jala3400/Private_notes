function confirmPassword() {
    const password2 = document.getElementById('password').value;
    window.electronAPI.confirmPassword(password2);
}

document.getElementById("loginbtn").onclick = confirmPassword;