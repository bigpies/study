// 什么是高阶函数
//   一个函数如果他的参数或者返回是一个函数，那么他就是高阶函数

function say(a,b){
  console.log('say',a,b);
}
// 给某个方法 添加一个方法并在他执行之前调用
Function.prototype.before = function (callback) {
  return (...args)=>{ // 理解下这里的args
      callback();    //执行传过来的匿名函数
      this(...args); // 执行this。可以暂时理解谁调用的this就指向谁：say.before  say调用的所以say指向say-
  }
}
let beforeSay = say.before(function(){
  console.log('before say')
})//将返回的函数赋值给beforeSay (参数函数)
beforeSay('hello','world');


// 柯里化
//   利用高阶函数提前把部分一个变量写好，调用的时候只需填写剩下的变量就好

function isType(type,value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
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
let isArray = currying(isType)('Array');//执行currying，传形参isType，执行return回来的函数同时传形参‘Array’，并把最后返回出来的fn（是刚才传进去的isType）赋值给isArray。其中处理看代码
let isString = currying(isType)('String');
console.log(isArray([]))
console.log(isArray('123'))
console.log(isString([]));
console.log(isString('123'));
