"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// Type Guards
function isAdmin(user) {
    return user.role === 'admin';
}
function isEditor(user) {
    return user.role === 'editor';
}
function isViewer(user) {
    return user.role === 'viewer';
}
// Auth Service Class
class AuthService {
    constructor() {
        this.currentUser = null;
        this.users = [
            {
                username: 'admin',
                password: 'admin',
                role: 'admin',
                canManageUsers: true,
                canEditContent: true
            },
            {
                username: 'editor',
                password: 'editor',
                role: 'editor',
                canManageUsers: false,
                canEditContent: true
            },
            {
                username: 'viewer',
                password: 'viewer',
                role: 'viewer',
                canManageUsers: false,
                canEditContent: false
            }
        ];
        this.content = "Initial content. Edit me!";
    }
    login(username, password, role) {
        const user = this.users.find(u => u.username === username &&
            u.password === password &&
            u.role === role);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }
    getCurrentUser() {
        if (!this.currentUser) {
            const storedUser = localStorage.getItem('currentUser');
            this.currentUser = storedUser ? JSON.parse(storedUser) : null;
        }
        return this.currentUser;
    }
    // User Management Methods
    getUsers() {
        return this.users.map((_a) => {
            var { password } = _a, rest = __rest(_a, ["password"]);
            return rest;
        });
    }
    addUser(username, password, role) {
        if (this.users.some(u => u.username === username))
            return false;
        let newUser;
        switch (role) {
            case 'admin':
                newUser = { username, password, role, canManageUsers: true, canEditContent: true };
                break;
            case 'editor':
                newUser = { username, password, role, canManageUsers: false, canEditContent: true };
                break;
            case 'viewer':
                newUser = { username, password, role, canManageUsers: false, canEditContent: false };
                break;
        }
        this.users.push(newUser);
        return true;
    }
    // Content Management Methods
    getContent() {
        return this.content;
    }
    updateContent(newContent) {
        this.content = newContent;
    }
}
const authService = new AuthService();
// Page Handlers
function handleLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('error');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;
            if (authService.login(username, password, userType)) {
                window.location.href = 'dashboard.html';
            }
            else {
                errorDiv.textContent = 'Invalid credentials. Please try again.';
            }
        });
    }
}
function handleDashboardPage() {
    var _a, _b;
    const currentUser = authService.getCurrentUser();
    const userInfoDiv = document.getElementById('userInfo');
    const adminPanel = document.getElementById('adminPanel');
    const editorPanel = document.getElementById('editorPanel');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    // Display user info
    userInfoDiv.innerHTML = `
      <h2>Welcome, ${currentUser.username}!</h2>
      <p>Role: ${currentUser.role}</p>
    `;
    // Show role-specific panels
    if (isAdmin(currentUser)) {
        adminPanel === null || adminPanel === void 0 ? void 0 : adminPanel.classList.remove('hidden');
        (_a = document.getElementById('manageUsers')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            window.location.href = 'manage-users.html';
        });
    }
    if (isEditor(currentUser) || isAdmin(currentUser)) {
        editorPanel === null || editorPanel === void 0 ? void 0 : editorPanel.classList.remove('hidden');
        (_b = document.getElementById('editContent')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            window.location.href = 'edit-content.html';
        });
    }
    setupCommonNavigation();
}
function handleManageUsersPage() {
    var _a;
    const currentUser = authService.getCurrentUser();
    const userListDiv = document.getElementById('userList');
    // Admin access only
    if (!currentUser || !isAdmin(currentUser)) {
        window.location.href = 'dashboard.html';
        return;
    }
    // Display users
    const users = authService.getUsers();
    userListDiv.innerHTML = `
      <h2>Current Users</h2>
      <ul>
        ${users.map(user => `
          <li>
            ${user.username} (${user.role})
            ${user.username !== currentUser.username ?
        `<button class="delete-user" data-username="${user.username}">Delete</button>` : ''}
          </li>
        `).join('')}
      </ul>
      <div class="add-user">
        <h3>Add New User</h3>
        <input type="text" id="newUsername" placeholder="Username">
        <input type="password" id="newPassword" placeholder="Password">
        <select id="newUserRole">
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <button id="addUserBtn">Add User</button>
      </div>
    `;
    // Add user functionality
    (_a = document.getElementById('addUserBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const role = document.getElementById('newUserRole').value;
        if (authService.addUser(username, password, role)) {
            alert('User added successfully!');
            window.location.reload();
        }
        else {
            alert('Username already exists!');
        }
    });
    setupCommonNavigation();
}
function handleEditContentPage() {
    var _a;
    const currentUser = authService.getCurrentUser();
    const editor = document.getElementById('contentEditor');
    // Editor+ access only
    if (!currentUser || !(isAdmin(currentUser) || isEditor(currentUser))) {
        window.location.href = 'dashboard.html';
        return;
    }
    // Load content
    editor.value = authService.getContent();
    // Save content
    (_a = document.getElementById('saveContent')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        authService.updateContent(editor.value);
        alert('Content saved!');
    });
    setupCommonNavigation();
}
function setupCommonNavigation() {
    var _a, _b;
    (_a = document.getElementById('backToDashboard')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
    (_b = document.getElementById('logout')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        authService.logout();
        window.location.href = 'index.html';
    });
}
// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('index.html')) {
        handleLoginPage();
    }
    else if (path.endsWith('dashboard.html')) {
        handleDashboardPage();
    }
    else if (path.endsWith('manage-users.html')) {
        handleManageUsersPage();
    }
    else if (path.endsWith('edit-content.html')) {
        handleEditContentPage();
    }
});
