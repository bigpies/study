// promisify
function promisify(func){
  return function(...args){
    return new Promise((r,j)=>{
      function callback(err, res){
        if(err) j(err)
        r(res)
      }
      func.apply(this,[...args, callback])
    })
  }
}

// create wrappers
let f1000 = delay(f, 1000);
let f1500 = delay(f, 1500);

f1000("test"); // 在 1000ms 后显示 "test"
f1500("test"); // 在 1500ms 后显示 "test"

function debounce(func, time){
  let timeId = null
  return function(...args){
    if(timeId){
      clearTimeout(timeId)
    }
    timeId = setTimeout(()=>{
      func.apply(this, args)
    },time)
  }
}

let f = debounce(console.log, 1000)
f('a')
setTimeout( () => f("b"), 200);
setTimeout( () => f("c"), 500);
setTimeout( () => f("d"), 500);
setTimeout( () => f("e"), 500);

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
        // 想一想这里为什么不用func.apply(savedThis, savedArgs)
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }
  return wrapper;
}