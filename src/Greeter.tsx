export class Greeter {
  private greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  public greet = (): string => {
    return this.greeting
  }
  public getGreeting = (): string => {
    return this.greeting
  }
  public setGreeting = (a: string) => {
    this.greeting = a
  }
}

console.log(new Greeter("hi").getGreeting())

// javaだと、Greeter a = new Greeter('hello')だったと思う
const a = new Greeter('hello')

console.log(a.getGreeting())

a.setGreeting('goodbye')

console.log(a.getGreeting())
