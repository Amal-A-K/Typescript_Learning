interface User{
    readonly id: number,
    name: string,
    email: string,
    age?: number,
    role?: "admin" | "user"
}

const users: User[] =[];

const form = document.getElementById('userForm') as HTMLFormElement;
const outputDiv = document.getElementById('userOutput') as HTMLDivElement;
const errorDiv =  document.getElementById('error-message') as HTMLDivElement;
errorDiv.className = 'error-message';

//Validate functions

//Name validation
function nameValidation(name: string):boolean{
    return name.length>=2;
}

//Email Validation
function emailValidation(email : string):boolean{
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(email);
}

//Age Validation
function ageValidation(ageValue: string): number | null | undefined {
    if (!ageValue) return undefined; // Age is optional
    
    const age = parseInt(ageValue);
    return !isNaN(age) && age >= 1 && age <= 120 ? age : null;
}

//Role validation
function roleValidation(roleValue: string): "admin" | "user" | undefined {
    return roleValue === "admin" || roleValue === "user" 
        ? roleValue as "admin" | "user" 
        : undefined;
}


form.addEventListener('submit', (e) => {
    e.preventDefault();


    errorDiv.textContent = '';
    errorDiv.style.display = 'none';

    // Get and trim values
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const ageInp = form.elements.namedItem('age') as HTMLInputElement;
    const roleSelect = form.elements.namedItem('role') as HTMLSelectElement;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const ageValue = ageInp.value.trim();
    const roleValue = roleSelect.value.trim();

    // Validate inputs (corrected conditions)
    if (!nameValidation(name)) {
        showError("Name must be at least 2 characters");
        return;
    }

    if (!emailValidation(email)) {
        showError("Please enter a valid email address");
        return;
    }

    const age = ageValidation(ageValue);
    if (age === null) {
        showError("Please enter a valid age between 1 and 120");
        return;
    }

    const role = roleValidation(roleValue);
    if (!role) {
        showError("Please select a valid role");
        return;
    }

    // Create and add user
    const newUser: User = {
        id: users.length + 1,
        name,
        email,
        ...(age && { age }),
        ...(role && { role })
    };

    users.push(newUser);
    renderUsers();
    form.reset();
});
function renderUsers(){
    outputDiv.innerHTML = users.map((user)=>`
    <div class="user-card">
    <h3> ${user.name} ${user.role? `(${user.role})`:" "}</h3>
    <p>Email ${user.email}</p>
    ${user.age? `<p> Age ${user.age}</p>` : ""}
    </div>`
    
    )
    .join("");
}
//  Error display
// function showError(message: string) {
//     outputDiv.innerHTML = `<div class="error">${message}</div>`;
//     setTimeout(() => outputDiv.innerHTML = '', 3000);
//   }
  function showError(message: string) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }, 3000);
}
