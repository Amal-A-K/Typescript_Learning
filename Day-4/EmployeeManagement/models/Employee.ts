import { Person } from "./Person";
import { Printable } from "../interfaces/Printable";

export class Employee extends Person implements Printable{
    private salary:number;
    constructor(name:string, age:number,private employeeId:number, salary:number){
        super(name,age);
        this.salary = salary;
    }
    getRole(): string {
        return "Employee";
    }
    printDetails(): string {
        return`
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