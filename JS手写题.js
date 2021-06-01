// 装饰器模式（promisify、防抖节流）

// promisify
// 用法：
// let loadScriptPromise = promisify(loadScript);
// loadScriptPromise(...).then(...);
function promisify(f) {
  return function (...args) { 
    return new Promise((resolve, reject) => {
      function callback(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
      args.push(callback); 
      f.call(this, ...args);
    });
  };
}

// debounce
function debounce(f, ms){
  let timeId = null
  return function(...args){
    clearTimeout(timeId)
    timeId = setTimeout(()=>{
      f.apply(this, args)
    },ms)
  }
}

// 测试
function test(params){
  console.log('test', params)
}
debounceTest = debounce(test, 1000)
debounceTest('ssp')
debounceTest('ssp')
debounceTest('ssp')

// throttle
// 一段时间内有多次点击
// 但是单位时间内，只有一个被执行（单位时间内的最后一个）
// 第一次点击立即执行
function throttle(func, ms) {
  let isThrottled = false,
    savedArgs,
    savedThis;
  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }
    func.apply(this, arguments);
    isThrottled = true;
    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        // 重点，想想为啥不能用f.apply(thisTarger, thisArg);
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }
  return wrapper;
}

function test(params){
  console.log('test', params)
}

throttleTest = throttle(test, 3000)

for(let i=0; i<20; i++){
  setTimeout(()=>{
    throttleTest(i)
  },i*1000)
}