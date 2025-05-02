import { User, UserRole, getUsers, saveUsers } from "./script";

// Function to handle registration
function handleRegistration(): void {
    console.log("working")
  const regName = document.getElementById("regName") as HTMLInputElement;
  const regPassword = document.getElementById("regPassword") as HTMLInputElement;
  const regRole = document.getElementById("regRole") as HTMLSelectElement;
  const regError = document.getElementById("regError") as HTMLParagraphElement;

  const name = regName.value.trim();
  const password = regPassword.value;
  const role = regRole.value as UserRole;

  if (!name || !password) {
    regError.textContent = "All fields are required.";
    return;
  }

  const users = getUsers();
  if (users.some(u => u.name === name)) {
    regError.textContent = "User already exists.";
    return;
  }

  const newUser: User = {
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
function initRegistration(): void {
  const registerButton = document.getElementById("registerBtn") as HTMLButtonElement;
  registerButton.addEventListener("click", handleRegistration);
}

// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", initRegistration);
