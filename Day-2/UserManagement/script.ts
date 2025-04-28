// 1. Define enums for roles and status
enum Role {
    admin = "admin",
    user = "user"
  }
  
  enum Status {
    Active = "active",
    Inactive = "inactive"
  }
  
  // 2. Define tuple type: [name, age, email, role, status]
  type UserData = [string, number, string, Role, Status];
  
  // 3. Initialize users array
  const users: UserData[] = [];
  
  // 4. Get DOM elements
  const form = document.getElementById('userForm') as HTMLFormElement;
  const outputDiv = document.getElementById('output') as HTMLDivElement;
  
  // 5. Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const ageInput = form.elements.namedItem('age') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const roleSelect = form.elements.namedItem('role') as HTMLSelectElement;
  
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
    const newUser: UserData = [name, age, email, role as Role, Status.Active];
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
  (window as any).toggleStatus = (index: number) => {
    users[index][4] = users[index][4] === Status.Active 
      ? Status.Inactive 
      : Status.Active;
    displayUsers();
  };
  
  // 8. Error display
  function showError(message: string) {
    outputDiv.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => outputDiv.innerHTML = '', 3000);
  }