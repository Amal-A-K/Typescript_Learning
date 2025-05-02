import { getUsers, getCurrentUser, saveUsers } from "./script";
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
function initializeUserList(currentUser) {
    const userList = document.getElementById("userList");
    const users = getUsers();
    userList.innerHTML = "<h4>All Users</h4>";
    users.forEach((user, index) => {
        const userItem = document.createElement("div");
        userItem.className = "user-item";
        userItem.innerHTML = `
      <div class="user-info">
        <b>${user.name}</b> (${user.role}) - Age: ${user.age}
      </div>
      <div class="user-actions">
        ${currentUser.canEdit ? `<button class="edit-btn" data-index="${index}">✏️ Edit</button>` : ''}
        ${currentUser.canDelete ? `<button class="delete-btn" data-index="${index}">🗑️ Delete</button>` : ''}
      </div>
    `;
        userList.appendChild(userItem);
    });
    // Add event listeners for edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            editUser(index);
        });
    });
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteUser(index);
        });
    });
}
function editUser(index) {
    const users = getUsers();
    const user = users[index];
    const validRoles = ["admin", "editor", "viewer", "moderator"];
    const newName = prompt("Enter new name:", user.name);
    const newAge = prompt("Enter new age:", user.age.toString());
    const newRole = prompt(`Enter new role (${validRoles.join("/")}):`, user.role);
    if (!newName || !newAge || !validRoles.includes(newRole)) {
        alert("Invalid input. Please try again.");
        return;
    }
    const ageNumber = parseInt(newAge);
    if (isNaN(ageNumber) || ageNumber <= 0) {
        alert("Please enter a valid age.");
        return;
    }
    // Update user
    users[index] = Object.assign(Object.assign({}, user), { name: newName, age: ageNumber, role: newRole, canEdit: newRole !== "viewer", canDelete: newRole === "admin" });
    saveUsers(users);
    // If editing current user, update their session
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.name === user.name) {
        localStorage.setItem("currentUser", JSON.stringify(users[index]));
    }
    location.reload();
}
function deleteUser(index) {
    const users = getUsers();
    const userToDelete = users[index];
    // Prevent deleting yourself
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.name === userToDelete.name) {
        alert("You cannot delete yourself!");
        return;
    }
    if (confirm(`Are you sure you want to delete user ${userToDelete.name}?`)) {
        users.splice(index, 1);
        saveUsers(users);
        location.reload();
    }
}
window.addEventListener("DOMContentLoaded", () => {
    const currentUser = getCurrentUser();
    const userInfo = document.getElementById("userInfo");
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", logout);
    if (!currentUser) {
        userInfo.innerHTML = "<p>User not logged in. <a href='index.html'>Please login</a></p>";
        return;
    }
    userInfo.innerHTML = `
    <h3>Welcome, ${currentUser.name} (${currentUser.role})</h3>
    <ul>
      <li>Age: ${currentUser.age}</li>
      <li>Edit permissions: ${currentUser.canEdit ? '✅' : '❌'}</li>
      <li>Delete permissions: ${currentUser.canDelete ? '✅' : '❌'}</li>
    </ul>
  `;
    if (currentUser.canEdit || currentUser.canDelete) {
        initializeUserList(currentUser);
    }
});
