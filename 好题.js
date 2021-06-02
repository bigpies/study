/** 1 */
let animal = {
  eats: true
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

let rabbit = new Rabbit("White Rabbit");
// rabbit.constructor指向的是什么

/** 2 */
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

/** 3 */
ssp = 'window: ssp'
function test() {
  let ssp = 'test'
  console.log('test, this.ssp', this.ssp, '--', this)
  return function testin() {
    console.log('testin, this.ssp', this.ssp, '--', this)
    
  }
}
a={
  ssp: 'aa',
  test,
}
// 以下的结果是？
// test()()
// a.test()()
// -->探索
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    // 为什么会有这句话？=====>a.test()()
    var ctx = this;
    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }
    return function (done) {
      var called;
      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });
      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);


/** 4 */
const a = {
  b: 2,
  foo: function () { console.log(this.b) }
}
function b(foo) {
  foo()
}
// 输出什么？
b(a.foo)

