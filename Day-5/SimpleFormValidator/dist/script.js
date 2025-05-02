// User management functions
export function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}
export function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
}
export function saveCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}
// Login function
export function login(username, password) {
    if (!username || !password) {
        return false;
    }
    const users = getUsers();
    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        saveCurrentUser(user);
        return true;
    }
    return false;
}
// Initialize login functionality when DOM is loaded
function initializeLogin() {
    const loginInput = document.getElementById("loginInput");
    const passwordInput = document.getElementById("passwordInput");
    const loginError = document.getElementById("loginError");
    const loginButton = document.querySelector(".container button");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            const username = loginInput.value.trim();
            const password = passwordInput.value;
            if (!username || !password) {
                loginError.textContent = "All fields required.";
                return;
            }
            if (login(username, password)) {
                window.location.href = "dashboard.html";
            }
            else {
                loginError.textContent = "Invalid username or password.";
            }
        });
    }
}
// Initialize when DOM is loaded
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initializeLogin);
}
