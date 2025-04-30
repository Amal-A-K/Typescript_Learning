export abstract class Person {
    constructor(public name: string, protected age: number) {}
    abstract getRole(): string;
  }
  