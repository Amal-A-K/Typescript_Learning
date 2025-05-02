"use strict";
function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.conatiner button');
    const errMsg = document.getElementById('error-msg');
    const form = document.getElementById('form-data');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            if (!username || !password) {
                errMsg.textContent = "All fields required.";
                return;
            }
            if (username === "admin" && password === "password") {
                window.location.href = "dashboard.html";
            }
            else {
                errMsg.textContent = "Invalid credentials";
            }
        });
    }
}
