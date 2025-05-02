export type UserRole = "admin" | "editor" | "viewer" | "moderator";

export type User = {
  name: string;
  age: number;
  password: string;
  role: UserRole;
  canEdit: boolean;
  canDelete: boolean;
};

// User management functions
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export function saveUsers(users: User[]) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

export function saveCurrentUser(user: User) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

// Login function
export function login(username: string, password: string): boolean {
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
  const loginInput = document.getElementById("loginInput") as HTMLInputElement;
  const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
  const loginError = document.getElementById("loginError") as HTMLParagraphElement;
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
      } else {
        loginError.textContent = "Invalid username or password.";
      }
    });
  }
}

// Initialize when DOM is loaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializeLogin);
}