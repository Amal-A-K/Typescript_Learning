import { getUsers, saveUsers } from "./script";
// Function to handle registration
function handleRegistration() {
    const regName = document.getElementById("regName");
    const regPassword = document.getElementById("regPassword");
    const regRole = document.getElementById("regRole");
    const regError = document.getElementById("regError");
    const name = regName.value.trim();
    const password = regPassword.value;
    const role = regRole.value;
    if (!name || !password) {
        regError.textContent = "All fields are required.";
        return;
    }
    const users = getUsers();
    if (users.some(u => u.name === name)) {
        regError.textContent = "User already exists.";
        return;
    }
    const newUser = {
        name,
        age: 25,
        password,
        role,
        canEdit: role !== "viewer",
        canDelete: role === "admin"
    };
    users.push(newUser);
    saveUsers(users);
    alert("Registered successfully!");
    window.location.href = "index.html";
}
// Function to initialize registration
function initRegistration() {
    const registerButton = document.getElementById("registerBtn");
    registerButton.addEventListener("click", handleRegistration);
}
// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", initRegistration);
