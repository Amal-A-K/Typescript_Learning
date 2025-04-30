"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const Person_1 = require("./Person");
class Employee extends Person_1.Person {
    constructor(name, age, employeeId, salary) {
        super(name, age);
        this.employeeId = employeeId;
        this.salary = salary;
    }
    getRole() {
        return "Employee";
    }
    printDetails() {
        return `
        <div class="employee-card">
        <p><strong>Name:</strong> ${this.name}</p>
        <p><strong>Age:</strong> ${this.age}</p>
        <p><strong>ID:</strong> ${this.employeeId}</p>
        <p><strong>Salary:</strong> $${this.salary}</p>
        <p><strong>Role:</strong> ${this.getRole()}</p>
      </div>
      `;
    }
}
exports.Employee = Employee;
