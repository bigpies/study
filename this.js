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

function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    // 为什么会有这句话？
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




const a = {
  b: 2,
  foo: function () { console.log(this.b) }
}
function b(foo) {
  foo()
}
// 输出什么？
b(a.foo)