"use strict";
// 1. Define enums for roles and status
var Role;
(function (Role) {
    Role["admin"] = "admin";
    Role["user"] = "user";
})(Role || (Role = {}));
var Status;
(function (Status) {
    Status["Active"] = "active";
    Status["Inactive"] = "inactive";
})(Status || (Status = {}));
// 3. Initialize users array
const users = [];
// 4. Get DOM elements
const form = document.getElementById('userForm');
const outputDiv = document.getElementById('output');
// 5. Form submission handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.elements.namedItem('name');
    const ageInput = form.elements.namedItem('age');
    const emailInput = form.elements.namedItem('email');
    const roleSelect = form.elements.namedItem('role');
    // Trim and get values
    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value);
    const email = emailInput.value.trim();
    const role = roleSelect.value;
    // Validate name
    if (!name || name.length < 2) {
        showError("Name must be at least 2 characters");
        nameInput.focus();
        return;
    }
    // Validate age
    if (isNaN(age) || age < 1 || age > 120) {
        showError("Please enter a valid age (1-120)");
        ageInput.focus();
        return;
    }
    // Validate email (basic check)
    if (!email || !email.includes('@')) {
        showError("Please enter a valid email");
        emailInput.focus();
        return;
    }
    // Validate role
    if (!(role in Role)) {
        showError("Please select a valid role");
        roleSelect.focus();
        return;
    }
    // Add user if all validations pass
    const newUser = [name, age, email, role, Status.Active];
    users.push(newUser);
    displayUsers();
    form.reset();
});
// 6. Display all users
function displayUsers() {
    outputDiv.innerHTML = users.map(user => `
      <div class="user-card">
        <h3>${user[0]}</h3>
        <p>Age: ${user[1]}</p>
        <p>Email: ${user[2]}</p>
        <p>Role: ${user[3].toUpperCase()}</p>
        <p>Status: ${user[4]}</p>
        <button onclick="toggleStatus(${users.indexOf(user)})">
          Toggle Status
        </button>
      </div>
    `).join('');
}
// 7. Toggle user status
window.toggleStatus = (index) => {
    users[index][4] = users[index][4] === Status.Active
        ? Status.Inactive
        : Status.Active;
    displayUsers();
};
// 8. Error display
function showError(message) {
    outputDiv.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => outputDiv.innerHTML = '', 3000);
}
