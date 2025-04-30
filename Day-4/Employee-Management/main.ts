// Employee model with OOP
class Employee {
    constructor(
      public id: number,
      public name: string,
      public age: number,
      public salary: number
    ) {}
  
    getDetails(): string {
      return `<div class="details-card">
      <p class="p"><strong>Name:</strong> ${this.name}</p>
      <p class="p"><strong>Age:</strong> ${this.age}</p>
      <p class="p"><strong>Salary:</strong>${this.salary}</p>
      </div>`;
    }
  }
  
  // App controller
  class App {
    private employees: Employee[] = [];
    private currentId: number = 1;
  
    constructor() {
      if (window.location.pathname.includes("dashboard.html")) {
        this.initDashboard();
      } else {
        this.initLogin();
      }
    }
  
    private initLogin() {
      const loginForm = document.getElementById("login-form") as HTMLFormElement;
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
  
        if (username === "admin" && password === "admin") {
          window.location.href = "dashboard.html";
        } else {
          (document.getElementById("login-error") as HTMLElement).textContent =
            "Invalid credentials.";
        }
      });
    }
  
    private initDashboard() {
      const form = document.getElementById("employee-form") as HTMLFormElement;
      const list = document.getElementById("employee-list") as HTMLUListElement;
  
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = (document.getElementById("emp-name") as HTMLInputElement).value;
        const age = parseInt((document.getElementById("emp-age") as HTMLInputElement).value);
        const salary = parseFloat((document.getElementById("emp-salary") as HTMLInputElement).value);
  
        const newEmp = new Employee(this.currentId++, name, age, salary);
        this.employees.push(newEmp);
        form.reset();
        this.renderEmployees(list);
      });
  
      list.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const id = Number(target.dataset.id);
        if (target.classList.contains("delete")) {
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.renderEmployees(list);
        }
        if (target.classList.contains("edit")) {
          const emp = this.employees.find(emp => emp.id === id);
          if (emp) {
            (document.getElementById("emp-name") as HTMLInputElement).value = emp.name;
            (document.getElementById("emp-age") as HTMLInputElement).value = emp.age.toString();
            (document.getElementById("emp-salary") as HTMLInputElement).value = emp.salary.toString();
            this.employees = this.employees.filter(e => e.id !== id);
            this.renderEmployees(list);
          }
        }
      });
    }
  
    private renderEmployees(list: HTMLElement) {
      list.innerHTML = "";
      this.employees.forEach(emp => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${emp.getDetails()}
          <div class="edit-delete-btn">
          <button class="edit" data-id="${emp.id}">Edit</button>
          <button class="delete" data-id="${emp.id}">Delete</button>
          </div>
        `;
        list.appendChild(li);
      });
    }
  }
  
  new App();
  