function makeWorker() {
  let name = "Pete";
  return function() {
    let name = "ssp";
    console.log('name', name);
    console.log('this.name', this.name);

  };
}
name = "John";
let work = makeWorker();
work(); // 会显示什么？
