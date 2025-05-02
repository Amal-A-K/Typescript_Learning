// Type Definitions
interface BaseUser {
    username: string;
    password: string;
  }
  
  type UserRole = 'admin' | 'editor' | 'viewer';
  
  interface AdminUser {
    role: 'admin';
    canManageUsers: true;
    canEditContent: true;
  }
  
  interface EditorUser {
    role: 'editor';
    canManageUsers: false;
    canEditContent: true;
  }
  
  interface ViewerUser {
    role: 'viewer';
    canManageUsers: false;
    canEditContent: false;
  }
  
  type User = BaseUser & (AdminUser | EditorUser | ViewerUser);
  
  // Type Guards
  function isAdmin(user: User): user is BaseUser & AdminUser {
    return user.role === 'admin';
  }
  
  function isEditor(user: User): user is BaseUser & EditorUser {
    return user.role === 'editor';
  }
  
  function isViewer(user: User): user is BaseUser & ViewerUser {
    return user.role === 'viewer';
  }
  
  // Auth Service Class
  class AuthService {
    private currentUser: User | null = null;
    private users: User[] = [
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
    
    private content: string = "Initial content. Edit me!";
  
    login(username: string, password: string, role: UserRole): boolean {
      const user = this.users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role
      );
  
      if (user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      return false;
    }
  
    logout(): void {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    }
  
    getCurrentUser(): User | null {
      if (!this.currentUser) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUser = storedUser ? JSON.parse(storedUser) : null;
      }
      return this.currentUser;
    }
  
    // User Management Methods
    getUsers(): Omit<User, 'password'>[] {
      return this.users.map(({ password, ...rest }) => rest);
    }
  
    addUser(username: string, password: string, role: UserRole): boolean {
      if (this.users.some(u => u.username === username)) return false;
      
      let newUser: User;
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
    getContent(): string {
      return this.content;
    }
  
    updateContent(newContent: string): void {
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
        
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const userType = (document.getElementById('userType') as HTMLSelectElement).value as UserRole;
  
        if (authService.login(username, password, userType)) {
          window.location.href = 'dashboard.html';
        } else {
          errorDiv!.textContent = 'Invalid credentials. Please try again.';
        }
      });
    }
  }
  
  function handleDashboardPage() {
    const currentUser = authService.getCurrentUser();
    const userInfoDiv = document.getElementById('userInfo');
    const adminPanel = document.getElementById('adminPanel');
    const editorPanel = document.getElementById('editorPanel');
  
    if (!currentUser) {
      window.location.href = 'index.html';
      return;
    }
  
    // Display user info
    userInfoDiv!.innerHTML = `
      <h2>Welcome, ${currentUser.username}!</h2>
      <p>Role: ${currentUser.role}</p>
    `;
  
    // Show role-specific panels
    if (isAdmin(currentUser)) {
      adminPanel?.classList.remove('hidden');
      document.getElementById('manageUsers')?.addEventListener('click', () => {
        window.location.href = 'manage-users.html';
      });
    }
  
    if (isEditor(currentUser) || isAdmin(currentUser)) {
      editorPanel?.classList.remove('hidden');
      document.getElementById('editContent')?.addEventListener('click', () => {
        window.location.href = 'edit-content.html';
      });
    }
  
    setupCommonNavigation();
  }
  
  function handleManageUsersPage() {
    const currentUser = authService.getCurrentUser();
    const userListDiv = document.getElementById('userList');
    
    // Admin access only
    if (!currentUser || !isAdmin(currentUser)) {
      window.location.href = 'dashboard.html';
      return;
    }
  
    // Display users
    const users = authService.getUsers();
    userListDiv!.innerHTML = `
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
    document.getElementById('addUserBtn')?.addEventListener('click', () => {
      const username = (document.getElementById('newUsername') as HTMLInputElement).value;
      const password = (document.getElementById('newPassword') as HTMLInputElement).value;
      const role = (document.getElementById('newUserRole') as HTMLSelectElement).value as UserRole;
  
      if (authService.addUser(username, password, role)) {
        alert('User added successfully!');
        window.location.reload();
      } else {
        alert('Username already exists!');
      }
    });
  
    setupCommonNavigation();
  }
  
  function handleEditContentPage() {
    const currentUser = authService.getCurrentUser();
    const editor = document.getElementById('contentEditor') as HTMLTextAreaElement;
    
    // Editor+ access only
    if (!currentUser || !(isAdmin(currentUser) || isEditor(currentUser))) {
      window.location.href = 'dashboard.html';
      return;
    }
  
    // Load content
    editor.value = authService.getContent();
  
    // Save content
    document.getElementById('saveContent')?.addEventListener('click', () => {
      authService.updateContent(editor.value);
      alert('Content saved!');
    });
  
    setupCommonNavigation();
  }
  
  function setupCommonNavigation() {
    document.getElementById('backToDashboard')?.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
    
    document.getElementById('logout')?.addEventListener('click', () => {
      authService.logout();
      window.location.href = 'index.html';
    });
  }
  
  // Initialize based on current page
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.endsWith('index.html')) {
      handleLoginPage();
    } else if (path.endsWith('dashboard.html')) {
      handleDashboardPage();
    } else if (path.endsWith('manage-users.html')) {
      handleManageUsersPage();
    } else if (path.endsWith('edit-content.html')) {
      handleEditContentPage();
    }
  });