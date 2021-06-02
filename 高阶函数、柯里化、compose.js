// 什么是高阶函数
//   一个函数如果他的参数或者返回是一个函数，那么他就是高阶函数

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

const currying = (fn,type = []) => {
  const len = fn.length
  return (...args) => {
    const params = [...type, ...args]
    console.log('args: ', args);
    if(params.length < len){
      return currying(fn, params)
    }else{
      return fn(...params)
    }
  }
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