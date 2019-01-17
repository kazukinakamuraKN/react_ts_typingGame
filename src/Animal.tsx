export class Animal {
  // 初期値の指定ができる
  public jump = (time: number = 20): string => {
    return `動物は${time}回飛んだ`
  }
}

export class wolf extends Animal {
  public bark = (): string => {
    return 'woofと叫んだ'
  }
}

const a = new wolf()
console.log(a.jump(12))
console.log(a.jump())