function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

// 变种，这个有些不一样
// 写一个函数 sum，它有这样的功能：
sum(1)(2) == 3; // 1 + 2
sum(1)(2)(3) == 6; // 1 + 2 + 3
sum(5)(-1)(2) == 6
sum(6)(-1)(-2)(-3) == 0
sum(0)(1)(2)(3)(4)(5) == 15

function sum(a){
  let acc = a
  function f(b){
    acc += b
    return f
  }
  f.toString = function(){
    return acc
  }
  return f
}

/*
  compose
  https://segmentfault.com/a/1190000011447164

  function a1(a){
    return a+1
  }
  function a2(a){
    return a+2
  }
  function a3(a){
    return a+3
  }
  let tasks = [a1,a2,a3]

  function compose(funcArr){
    // 写在此处
  }
  let composeFunc = compose(tasks)

  composeFunc(10)


  const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)))
*/

// 自己的写法
function compose(funcArr){
  return function(...args){
    return funcArr.reduce((params, func)=>{
      return func.apply(this, Array.isArray(params)?params:[params])
    }, args)
  }
}