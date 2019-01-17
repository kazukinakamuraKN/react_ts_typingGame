export class Animal2 {
  public name: string
  constructor(a: string) {
    this.name = a
  }
  public move = (a: number = 0): void => {
    console.log(this.name + 'is moved' + a)
  }
}

export class Sname extends Animal2 {
  constructor(name: string) {
    super(name)
  }
  // public move = (a: number) => {
  //   super.move(a)
  // }
}