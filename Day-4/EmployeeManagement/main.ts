import { Employee } from "./models/Employee";
import { Manager } from "./models/Manager";
import { Printable } from "./interfaces/Printable";

const emp1 = new Employee("John", 28, 101, 50000);
const mgr1 = new Manager("Alice", 35, 201, 90000, "Engineering");

const staff: Printable[] = [emp1, mgr1];

const btn = document.getElementById("load-btn") as HTMLButtonElement;
const output = document.getElementById("output") as HTMLDivElement;
const form = document.getElementById("staff-form") as HTMLFormElement;
const roleSelect = document.getElementById("role") as HTMLSelectElement;
const departmentInput = document.getElementById("department") as HTMLInputElement;

roleSelect.addEventListener("change", () => {
  if (roleSelect.value === "Manager") {
    departmentInput.style.display = "block";
  } else {
    departmentInput.style.display = "none";
    departmentInput.value = ""; // clear any leftover value
  }
});


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = (document.getElementById("name") as HTMLInputElement).value;
  const age = parseInt((document.getElementById("age") as HTMLInputElement).value);
  const id = parseInt((document.getElementById("id") as HTMLInputElement).value);
  const salary = parseFloat((document.getElementById("salary") as HTMLInputElement).value);
  const role = roleSelect.value;
  const department = (document.getElementById("department") as HTMLInputElement).value;

  let newStaff: Printable;

  if (role === "Manager") {
    newStaff = new Manager(name, age, id, salary, department);
  } else {
    newStaff = new Employee(name, age, id, salary);
  }

  staff.push(newStaff);
  renderStaff();
  form.reset();
});


function renderStaff() {
    output.innerHTML = staff.map(person => `<div class="employee-card">${person.printDetails()}</div>`).join("");
  }
  
  
  btn.addEventListener("click", renderStaff);
  