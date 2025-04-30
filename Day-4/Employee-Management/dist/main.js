"use strict";
// Employee model with OOP
class Employee {
    constructor(id, name, age, salary) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.salary = salary;
    }
    getDetails() {
        return `<div class="details-card">
      <p class="p"><strong>Name:</strong> ${this.name}</p>
      <p class="p"><strong>Age:</strong> ${this.age}</p>
      <p class="p"><strong>Salary:</strong>${this.salary}</p>
      </div>`;
    }
}
// App controller
class App {
    constructor() {
        this.employees = [];
        this.currentId = 1;
        if (window.location.pathname.includes("dashboard.html")) {
            this.initDashboard();
        }
        else {
            this.initLogin();
        }
    }
    initLogin() {
        const loginForm = document.getElementById("login-form");
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            if (username === "admin" && password === "admin") {
                window.location.href = "dashboard.html";
            }
            else {
                document.getElementById("login-error").textContent =
                    "Invalid credentials.";
            }
        });
    }
    initDashboard() {
        const form = document.getElementById("employee-form");
        const list = document.getElementById("employee-list");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("emp-name").value;
            const age = parseInt(document.getElementById("emp-age").value);
            const salary = parseFloat(document.getElementById("emp-salary").value);
            const newEmp = new Employee(this.currentId++, name, age, salary);
            this.employees.push(newEmp);
            form.reset();
            this.renderEmployees(list);
        });
        list.addEventListener("click", (e) => {
            const target = e.target;
            const id = Number(target.dataset.id);
            if (target.classList.contains("delete")) {
                this.employees = this.employees.filter(emp => emp.id !== id);
                this.renderEmployees(list);
            }
            if (target.classList.contains("edit")) {
                const emp = this.employees.find(emp => emp.id === id);
                if (emp) {
                    document.getElementById("emp-name").value = emp.name;
                    document.getElementById("emp-age").value = emp.age.toString();
                    document.getElementById("emp-salary").value = emp.salary.toString();
                    this.employees = this.employees.filter(e => e.id !== id);
                    this.renderEmployees(list);
                }
            }
        });
    }
    renderEmployees(list) {
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
