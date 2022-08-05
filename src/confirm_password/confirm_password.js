function confirmPassword() {
    //Sends the second password to the main process to verify it
    const password2 = document.getElementById('password').value;
    window.electronAPI.confirmPassword(password2);
}

function cancel() {
    //Goes back to the login page
    window.location.assign("../login/login.html");
}

document.getElementById("loginbtn").onclick = confirmPassword;
document.getElementById("cancelbtn").onclick = cancel;

document.getElementById("password").addEventListener('input', (event) => {
    // Validate the entire form to see if we should enable the `Submit` button.
    document.getElementById('loginbtn').disabled = !document.getElementById("password").checkValidity();
});

//Focus the password input
document.getElementById('password').focus();