"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const Employee_1 = require("./Employee");
class Manager extends Employee_1.Employee {
    constructor(name, age, id, salary, department) {
        super(name, age, id, salary);
        this.department = department;
    }
    getRole() {
        return "Manager";
    }
    printDetails() {
        return super.printDetails().replace('</div>', `<p><strong>Department:</strong> ${this.department}</p></div>`);
    }
}
exports.Manager = Manager;
