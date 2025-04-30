"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Employee_1 = require("./models/Employee");
const Manager_1 = require("./models/Manager");
const emp1 = new Employee_1.Employee("John", 28, 101, 50000);
const mgr1 = new Manager_1.Manager("Alice", 35, 201, 90000, "Engineering");
const staff = [emp1, mgr1];
const btn = document.getElementById("load-btn");
const output = document.getElementById("output");
const form = document.getElementById("staff-form");
const roleSelect = document.getElementById("role");
const departmentInput = document.getElementById("department");
roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "Manager") {
        departmentInput.style.display = "block";
    }
    else {
        departmentInput.style.display = "none";
        departmentInput.value = ""; // clear any leftover value
    }
});
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const id = parseInt(document.getElementById("id").value);
    const salary = parseFloat(document.getElementById("salary").value);
    const role = roleSelect.value;
    const department = document.getElementById("department").value;
    let newStaff;
    if (role === "Manager") {
        newStaff = new Manager_1.Manager(name, age, id, salary, department);
    }
    else {
        newStaff = new Employee_1.Employee(name, age, id, salary);
    }
    staff.push(newStaff);
    renderStaff();
    form.reset();
});
function renderStaff() {
    output.innerHTML = staff.map(person => `<div class="employee-card">${person.printDetails()}</div>`).join("");
}
btn.addEventListener("click", renderStaff);
