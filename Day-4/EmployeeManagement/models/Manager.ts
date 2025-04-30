import { Employee } from "./Employee";
export class Manager extends Employee{
    constructor(name:string,age:number,id:number,salary:number, private department:string){
        super(name,age,id,salary);
    }
    getRole(): string {
        return "Manager";
    }
    override printDetails(): string {
        return super.printDetails().replace('</div>',`<p><strong>Department:</strong> ${this.department}</p></div>`);
    }
}