// ==========================================
//          Models & Interfaces
// ==========================================

interface User {
  username: string;
  password: string;
}

interface Item {
  id: number;
  title: string;
}

interface Book extends Item {
  author: string;
  price: number;
}

// ==========================================
//        Generic Data Wrapper Class
// ==========================================

class ArrayWrapper<T extends Item> {
  private items: T[] = [];

  add(item: T): void {
    if (this.findById(item.id)) {
      console.warn(`Item with ID ${item.id} already exists. Not adding duplicate.`);
      return;
    }
    this.items.push(item);
  }

  getAll(): readonly T[] {
    return this.items;
  }

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }
}

// ==========================================
//             Book Data Setup
// ==========================================

const bookStore = new ArrayWrapper<Book>();
bookStore.add({ id: 1, title: "Clean Code", author: "Robert C. Martin", price: 300 });
bookStore.add({ id: 2, title: "You Don’t Know JS", author: "Kyle Simpson", price: 250 });
bookStore.add({ id: 3, title: "Effective TypeScript: 62 Specific Ways to Improve Your TypeScript", author: "Dan Vanderkam", price: 250 });
bookStore.add({ id: 4, title: "Essential TypeScript 5", author: "Adam Freeman", price: 250 });
bookStore.add({ id: 5, title: "A Smarter Way to Learn JavaScript", author: "Mark Myers", price: 300 });
bookStore.add({ id: 6, title: "Java: A Beginner's Guide", author: "Herbert Schildt", price: 300 });

// ==========================================
//          Storage Utilities
// ==========================================

const USERS_STORAGE_KEY = "users";
const LOGGED_IN_USER_STORAGE_KEY = "loggedInUser";
const CART_STORAGE_KEY = "cart"; 

// --- User Storage ---
function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersJson) return [];
  try {
    return JSON.parse(usersJson) as User[];
  } catch (error) {
    console.error("Error parsing users from localStorage:", error);
    return [];
  }
}

// --- Logged-in User Storage ---
function getLoggedInUser(): string | null {
  return localStorage.getItem(LOGGED_IN_USER_STORAGE_KEY);
}

function saveLoggedInUser(username: string): void {
  localStorage.setItem(LOGGED_IN_USER_STORAGE_KEY, username);
}

function removeLoggedInUser(): void {
  localStorage.removeItem(LOGGED_IN_USER_STORAGE_KEY);
}

// --- Cart Storage ---
function getCartKey(username: string): string {
  return `${CART_STORAGE_KEY}-${username}`;
}

function saveCart(username: string, cart: Book[]): void {
  const key = getCartKey(username);
  localStorage.setItem(key, JSON.stringify(cart));
}

function getCart(username: string): Book[] {
  const key = getCartKey(username);
  const cartJson = localStorage.getItem(key);
  if (!cartJson) return [];
  try {
    return JSON.parse(cartJson) as Book[];
  } catch (error) {
    console.error(`Error parsing cart for user ${username} from localStorage:`, error);
    return [];
  }
}

// ==========================================
//       UI Message Display Utilities
// ==========================================

type MessageType = 'success' | 'error' | 'info' | 'warning';

/**
 * Displays a message in a specified HTML element.
 * Assumes the element exists and has CSS classes like 'message-success', 'message-error', etc.
 * @param elementId The ID of the HTML element to display the message in.
 * @param message The text message to display.
 * @param type The type of message (for styling).
 * @param clearAfterMs Optional: Time in milliseconds after which to clear the message.
 */
function displayMessage(elementId: string, message: string, type: MessageType, clearAfterMs?: number): void {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.classList.remove('message-success', 'message-error', 'message-info', 'message-warning');
    messageElement.classList.add(`message-${type}`);
    messageElement.style.display = 'block';
    if (clearAfterMs && clearAfterMs > 0) {
      setTimeout(() => {
        clearMessage(elementId);
      }, clearAfterMs);
    }
  } else {
    console.error(`Message element with ID '${elementId}' not found.`);
  }
}

/**
 * Clears the message from a specified HTML element.
 * @param elementId The ID of the HTML element to clear.
 */
function clearMessage(elementId: string): void {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = '';
    messageElement.classList.remove('message-success', 'message-error', 'message-info', 'message-warning');
    messageElement.style.display = 'none';
  }
}

// ==========================================
//      UI Element Helper Function
// ==========================================
function getInputValue(elementId: string): string {
  const inputElement = document.getElementById(elementId) as HTMLInputElement | null;
  return inputElement ? inputElement.value.trim() : "";
}

// Helper to add input listeners to clear messages
function addInputListenersToClearMessage(elementIds: string[], messageElementId: string) {
  elementIds.forEach(id => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.addEventListener('input', () => clearMessage(messageElementId));
    }
  });
}

// ==========================================
//             Signup Logic
// ==========================================
// --- Assumed HTML for Signup ---
// <input id="signup-username" type="text" placeholder="Username">
// <input id="signup-password" type="password" placeholder="Password">
// <button id="signup-btn" type="button">Sign Up</button>
// <div id="signup-message" class="message-area"></div>
const signupBtn = document.getElementById("signup-btn");
const SIGNUP_MESSAGE_ID = 'signup-message';

if (signupBtn) {
  addInputListenersToClearMessage(['signup-username', 'signup-password'], SIGNUP_MESSAGE_ID);

  signupBtn.addEventListener("click", () => {
    const username = getInputValue("signup-username");
    const password = getInputValue("signup-password");

    if (!username || !password) {
      displayMessage(SIGNUP_MESSAGE_ID, "Username and password cannot be empty.", 'error');
      return;
    }

    const users = getUsers();

    if (users.find(u => u.username === username)) {
      displayMessage(SIGNUP_MESSAGE_ID, "Username already exists!", 'error');
      return;
    }

    users.push({ username, password });
    saveUsers(users);

    displayMessage(SIGNUP_MESSAGE_ID, "Signup successful! Redirecting...", 'success', 1500);
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
}

// ==========================================
//              Login Logic
// ==========================================
// --- Assumed HTML for Login ---
// <input id="login-username" type="text" placeholder="Username">
// <input id="login-password" type="password" placeholder="Password">
// <button id="login-btn" type="button">Login</button>
// <div id="login-message" class="message-area"></div>
const loginBtn = document.getElementById("login-btn");
const LOGIN_MESSAGE_ID = 'login-message';

if (loginBtn) {
  addInputListenersToClearMessage(['login-username', 'login-password'], LOGIN_MESSAGE_ID);

  loginBtn.addEventListener("click", () => {
    const username = getInputValue("login-username");
    const password = getInputValue("login-password");

    if (!username || !password) {
      displayMessage(LOGIN_MESSAGE_ID, "Username and password cannot be empty.", 'error');
      return;
    }

    const users = getUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      saveLoggedInUser(username);
      displayMessage(LOGIN_MESSAGE_ID, "Login successful! Redirecting...", 'success', 1500);
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1500);
    } else {
      displayMessage(LOGIN_MESSAGE_ID, "Invalid username or password.", 'error');
    }
  });
}

// ==========================================
//         Book Shop Page Logic
// ==========================================
// --- Assumed HTML for Shop ---
// <div id="shop-list"></div>
// <div id="shop-message" class="message-area"></div>
const shopDiv = document.getElementById("shop-list");
const SHOP_MESSAGE_ID = 'shop-message';

if (shopDiv) {
  const loggedInUsername = getLoggedInUser();
  if (!loggedInUsername) {
    console.warn("User not logged in. Redirecting to login.");
    displayMessage(SHOP_MESSAGE_ID, "Please log in first.", 'warning', 100);
    setTimeout(() => {
      window.location.href = "login.html";
    }, 100);
  } else {
    console.log(`User '${loggedInUsername}' is viewing the shop.`);
    const cart = getCart(loggedInUsername);

    bookStore.getAll().forEach(book => {
      const bookItemDiv = document.createElement("div");
      bookItemDiv.classList.add("book-item");

      const detailsSpan = document.createElement("span");
      detailsSpan.textContent = `${book.title} - ₹${book.price.toFixed(2)} `;
      detailsSpan.classList.add("book-details");

      const addButton = document.createElement("button");
      addButton.textContent = "Add to Cart";
      addButton.setAttribute("data-id", book.id.toString());
      addButton.classList.add("add-button");

      bookItemDiv.appendChild(detailsSpan);
      bookItemDiv.appendChild(addButton);
      shopDiv.appendChild(bookItemDiv);
    });

    shopDiv.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" && target.classList.contains("add-button")) {
        const id = Number(target.getAttribute("data-id"));
        const book = bookStore.findById(id);

        if (book) {
          cart.push(book);
          saveCart(loggedInUsername, cart);
          displayMessage(SHOP_MESSAGE_ID, `"${book.title}" added to cart!`, 'success', 3000);
        } else {
          displayMessage(SHOP_MESSAGE_ID, `Error: Could not find book to add.`, 'error', 5000);
        }
      }
    });
  }
}

// ==========================================
//            Cart Page Logic
// ==========================================
// --- Assumed HTML for Cart ---
// <div id="cart-list"></div>
// <div id="cart-message" class="message-area"></div>
const cartDiv = document.getElementById("cart-list");
const CART_MESSAGE_ID = 'cart-message';

if (cartDiv) {
  (() => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      alert("Please log in to view your cart.");
      window.location.href = "login.html";
      return;
    }
    const cart = getCart(loggedInUser);
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
      displayMessage(CART_MESSAGE_ID, "Your cart is empty.", 'info');
      cartDiv.appendChild(document.getElementById(CART_MESSAGE_ID)!);
    } else {
      clearMessage(CART_MESSAGE_ID);
      let total = 0;
      cart.forEach(book => {
        const div = document.createElement("div");
        div.textContent = `${book.title} - ₹${book.price.toFixed(2)}`;
        div.classList.add("cart-item");
        cartDiv.appendChild(div);
        total += book.price;
      });

      const totalDiv = document.createElement("div");
      totalDiv.textContent = `Total: ₹${total.toFixed(2)}`;
      totalDiv.classList.add("cart-total");
      cartDiv.appendChild(totalDiv);
    }
  })();
}

// ==========================================
//    Optional: Logout Functionality
// ==========================================
// --- Assumed HTML for Logout ---
// <button id="logout-btn">Logout</button> (Place this where needed, e.g., in header)

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    removeLoggedInUser();
    console.log("User logged out.");
    window.location.href = "login.html";
  });
}

// ==========================================
//  Home page logic
// ==========================================
const welcomeMsg = document.getElementById("welcome-msg");
if (welcomeMsg) {
  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    welcomeMsg.textContent = `Welcome, ${loggedInUser}!`;
  } else {
    welcomeMsg.textContent = "Welcome, Guest!";
  }
}
