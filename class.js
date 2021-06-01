// 有没有什么类型判断的方法，判断出class


class User {
  constructor(name, age) {
    this.age = age;
    // 调用setter
    this.name = name;
  }
  // Getters/setters
  sayHi() {
    // 调用getter
    console.log('Hi', this.name);
  }
  get name() {
    return this._name;
  }
  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }
  // 计算属性
  ['say' + 'Hi']() {
    alert("Hello");
  }
  // 类字段（类字段重要的不同之处在于，它们会在每个独立对象中被设好，而不是设在 User.prototype：）
  name = "John";
}

// 类表达式
let User = class {
  sayHi() {
    alert("Hello");
  }
};