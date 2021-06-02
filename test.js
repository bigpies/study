const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  if(req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf8');
    res.setHeader('Content-Length', 10);
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write("<p>来啦</p>");
    setTimeout(() => {
      res.write("第一次传输<br/>");
    }, 1000);
    setTimeout(() => {
      res.write("第二次传输");
      res.end()
    }, 2000);
  }
})

server.listen(8009, () => {
  console.log("成功启动");
})

aa(f,ms)
function aa(f, ms){
  let savedThis, savedArgs,throttle=false
  return function bb(...args){
    if(throttle){
      savedThis = this;
      savedArgs = args;
    }else{
      f.apply(this,args)
      throttle = true
      setTimeout(()=>{
        throttle = false
        if(savedArgs){
          bb.apply(savedThis, savedArgs)
          savedThis = savedArgs = null
        }
      },ms)
    }
  }
}


let img = document.getElementsByTagName("img");

const observer = new IntersectionObserver(changes => {
  //changes 是被观察的元素集合
  for(let i = 0, len = changes.length; i < len; i++) {
    let change = changes[i];
    // 通过这个属性判断是否在视口中
    if(change.isIntersecting) {
      const imgElement = change.target;
      imgElement.src = imgElement.getAttribute("data-src");
      observer.unobserve(imgElement);
    }
  }
})
Array.from(img).forEach(item => observer.observe(item));

import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { func } from 'prop-types';

const withData = (WrappedComponent) => {
    class ProxyComponent extends React.Component {
        componentDidMount() {
            //code
        }
        //这里有个注意点就是使用时，我们需要知道这个组件是被包装之后的组件
        //将ref值传递给 forwardedRef 的 prop
        render() {
            const {forwardedRef, ...remainingProps} = this.props;
            return (
                <WrappedComponent ref={forwardedRef} {...remainingProps}/>
            )
        }
    }
    //指定 displayName.   未复制静态方法(重点不是为了讲 HOC)
    ProxyComponent.displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    //复制非 React 静态方法
    hoistNonReactStatic(ProxyComponent, WrappedComponent);
    return ProxyComponent;
}

function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, callback } // wd=b&callback=show
    let arrs = []
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`)
    }
    script.src = `${url}?${arrs.join('&')}`
    document.body.appendChild(script)
  })
}
jsonp({
  url: 'http://localhost:3000/say',
  params: { wd: 'Iloveyou' },
  callback: 'show'
}).then(data => {
  console.log(data)
})

function copy(target,copy = {}){
  for(let i in target){
    if(typeof target[i] === 'object' && target[i] !== null){
      if(Array.isArray(target[i])){
        copy[i] = copy(target[i], [])
      }else{
        copy[i] = copy(target[i], {})
      }
    }else{
      copy[i] = target[i]
    }
  }
  return copy
}


function promisify(f){
  return function(...args){
    return new Promise((r,j)=>{
      function callback(err,res){
        if(err) j(err);
        r(res);
      }
      f.apply(this, args.concat(callback))
    })
  }
}

// create wrappers
let f1000 = delay(f, 1000);
let f1500 = delay(f, 1500);

f1000("test"); // 在 1000ms 后显示 "test"
f1500("test"); // 在 1500ms 后显示 "test"

function debounce(func, time){
  let timeId = null;
  return function(...args){
    if(timeId){
      clearTimeout(timeId)
    }
    timeId = setTimeout(()=>{
      func.apply(this, args)
    },time)
  }
}

function throttle(func, time){
  let saveTag=false, savedArgs, savedThis, throttle=false
  return function throttled(...args){
    if(throttle){
      saveTag = true;
      savedArgs = args;
      savedThis = this;
    }else{
      throttle = true
      func.apply(this, args)
      setTimeout(()=>{
        if(saveTag){
          throttled.apply(savedThis, savedArgs)
        }
        throttle = false;
        saveTag = false;
        savedArgs = null;
        savedThis = null;
      }, time)
    }
  }
}

function sum(a,b,c,d){
  return a+b+c+d
}

function curry(f){
  return function curried(...args){
    if(args.length<f.length){
      return function(...args2){
        return curried(...args, ...args2)
      }
    }else{
      return f.apply(this, args)
    }
  }
}

function add(a){
  return a+1
}

function compose(funcStep){
  return function(...args){
    return funcStep.reduce((warpedFunc, itemFunc)=>itemFunc(warpedFunc), args)
  }
}

compose([add,add,add])(1)

const arr = [1, [2, [3, 4]]];
const arr1 = [{a:1},1, [2, [3, 4]]];

function flat(arr){
  let flatArr = []
  for(let i of arr){
    if(Array.isArray(i)){
      tmp = flat(i)
      flatArr = flatArr.concat(tmp)
    }else{
      flatArr.push(i)
    }
  }
  return flatArr
}
function flat(arr){
  
  return arr.toString().split(',')
}

f.call(this,...args)
function myCall(target,...args){
  const tmp = Symbol('tmp');
  const f = this;
  target[tmp] = f
  const res = target[tmp](...args);
  delete  target[tmp]
  return res
}

bindF = f.bind(target)
bindF(...)

function myBind(...args){
  const [target, ...restArgs] = args;
  const f = this;
  function binding(...args2){
    const finalArgs = restArgs.concat(args2)
    return f.apply(this instanceof binding ? this : target, finalArgs)
  }
  
  return binding;
}

Promise.myAll = function(iterators) {
  const promiseArr = Array.from(iterators)
  return new Promise((r,j)=>{
    const count = 0;
    const resArr = []
    promiseArr.foreach((promise,index)=>(
      Promise.resolve(promise)
        .then((res)=>{
          resArr[index]=res
          count+=1
          if(count === promiseArr.length){
            r(resArr)
          }
        })
        .catch(j)
    ))
  })
}


Promise.race = function(promiseArr){
  return new Promise((r,j)=>{
    promiseArr.forEach((promise)=>{
      Promise.resolve(promise)
        .then(r)
        .catch(j)
    })
  })
}



function myBind(...args){
  const f = this;
  const [target, ...rest] = args;
  function fTmp(){}
  fTmp.prototype = this.prototype;
  function binding(...args2){
    return f.apply(this instanceof binding? this: target, rest.concat(args))
  }
  binding.prototype = new fTmp()
  return binding
}


const first = () => (new Promise((resolve, reject) => {
  console.log(3);
  let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
          console.log(5);
          resolve(6);
          console.log(p)
      }, 0)
      resolve(1);
  });
  resolve(2);
  p.then((arg) => {
      console.log(arg);
  });
}));
first().then((arg) => {
  console.log(arg);
});
console.log(4);
// 3 7 4 1 2 5 resolved

const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0)
  resolve('resovle1');
  resolve('resolve2');
}).then(res => {
  console.log(res)
  setTimeout(() => {
    console.log(p1)
  }, 1000)
}).finally(res => {
  console.log('finally', res)
})

function now(){
  const date = new Date()
  return `${date.getMinutes()}:${date.getSeconds()}`
}
function red() {
  console.log('red3', now());
}
function yellow() {
  console.log('yellow2', now());
}
function green() {
  console.log('green1', now());
}

let light = [red, yellow, green]
let count = 0
function step(){
  new Promise((r)=>{
    light[count]()
    const ms = (3 - count) * 1000;
    count = (count + 1) % 3;
    setTimeout(()=>{
      r()
    },ms)
  }).then(step)
}

step()




const time = (timer) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}
const ajax1 = () => time(2000).then(() => {
  console.log(1);
  return 1
})
const ajax2 = () => time(1000).then(() => {
  console.log(2);
  return 2
})
const ajax3 = () => time(1000).then(() => {
  console.log(3);
  return 3
})

function mergePromise (arr) {
  const data=[];
  return new Promise((r)=>{
    arr.reduce((acc, promise)=>{
      return acc.then(()=>{
        return promise().then((res)=>{
          data.push(res);
          if(data.length >= arr.length){
            r(data)
          }
        });
      })
    }, Promise.resolve())
  })
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
  console.log("done");
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]

var data=[
  {prob:2,name:"特等奖"},
  {prob:5,name:"一等奖"},
  {prob:10,name:"二等奖"},
  {prob:30,name:"三等奖"},
  {prob:53,name:"四等奖"}
];
Array.prototype.byProbGetName=function (){
  var num=Math.random()*10000;
  var sum=0;
  for(var i=0;i<this.length;i++){
      sum+=(this[i].prob*100)
      if(sum>num){
          return this[i].name
      }
  }
}


var urls = [
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png",
];
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function() {
    	reject(new Error('Could not load image at' + url));
    };
    img.src = url;
  });
}


function limitLoad(urls, handler, limit) {
  let sequence = [].concat(urls); // 复制urls
  // 这一步是为了初始化 promises 这个"容器"
  let promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      // 返回下标是为了知道数组中是哪一项最先完成
      return index;
    });
  });
  // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
  return sequence
    .reduce((pCollect, url) => {
      return pCollect
        .then(() => {
          return Promise.race(promises); // 返回已经完成的下标
        })
        .then(fastestIndex => { // 获取到已经完成的下标
        	// 将"容器"内已经完成的那一项替换
          promises[fastestIndex] = handler(url).then(
            () => {
              return fastestIndex; // 要继续将这个下标返回，以便下一次变量
            }
          );
        })
        .catch(err => {
          console.error(err);
        });
    }, Promise.resolve()) // 初始化传入
    .then(() => { // 最后三个用.all来调用
      return Promise.all(promises);
    });
}
limitLoad(urls, loadImg, 3)
  .then(res => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });

// =====================》
// =====================》
// =====================》
// =====================》

  class Promise{
    // 传一个异步函数进来
    constructor(excutorCallBack){
      this.status = 'pending';
      this.value = undefined;
      this.fulfillAry = [];
      this.rejectedAry = [];
      //=>执行Excutor
      let resolveFn = result => {
        if(this.status !== 'pending') return;
        let timer = setTimeout(() => {
          this.status = 'fulfilled';
          this.value = result;
          this.fulfillAry.forEach(item => item(this.value));
        }, 0);
      };
      let rejectFn = reason => {
        if(this.status !== 'pending')return;
        let timer = setTimeout(() => {
          this.status = 'rejected';
          this.value = reason;
          this.rejectedAry.forEach(item => item(this.value))
        })
      };
      try{
        //执行这个异步函数
        excutorCallBack(resolveFn, rejectFn);
      } catch(err) {
        //=>有异常信息按照rejected状态处理
        rejectFn(err);
      }
    }
    then(fulfilledCallBack, rejectedCallBack) {
      //保证两者为函数
      typeof fulfilledCallBack !== 'function' ? fulfilledCallBack = result => result:null;
      typeof rejectedCallBack !== 'function' ? rejectedCallBack = reason => {
        throw new Error(reason instanceof Error? reason.message:reason);
      } : null
      //返回新的Promise对象，后面称它为“新Promise”
      return new Promise((resolve, reject) => {
        //注意这个this指向目前的Promise对象，而不是新的Promise
        //再强调一遍,很重要：
        //目前的Promise(不是这里return的新Promise)的resolve和reject函数其实一个作为微任务
        //因此他们不是立即执行，而是等then调用完成后执行
        this.fulfillAry.push(() => {
          try {
            //把then里面的方法拿过来执行
            //执行的目的已经达到
            let x = fulfilledCallBack(this.value);
            //下面执行之后的下一步，也就是记录执行的状态，决定新Promise如何表现
            //如果返回值x是一个Promise对象，就执行then操作
            //如果不是Promise,直接调用新Promise的resolve函数,
            //新Promise的fulfilAry现在为空,在新Promise的then操作后.新Promise的resolve执行
            x instanceof Promise ? x.then(resolve, reject):resolve(x);
          }catch(err){
            reject(err)
          }
        });
        //以下同理
        this.rejectedAry.push(() => {
          try {
            let x = rejectedCallBack(this.value);
            x instanceof Promise ? x.then(resolve, reject):resolve(x);
          }catch(err){
            reject(err)
          }
        })
      }) ;
    }
  }
  
  module.exports = Promise;

arr=[1,2,3]
arr.reduce((acc,value,index,this)=>{
  return acc
}, 1)

Array.prototype.reduce  = function(callback, initial){
  const arr = this;
  const acc = initial!==undefined ? initial : arr[0]
  let index = 0
  if(initial===undefined){
    index++;
  }
  for(;index<arr.length; index++){
    acc = callback.call(null, acc, arr[index], index, arr)
  }
  return acc
}
arr.map((item, index)=>{})
Array.prototype.map = function(callbackFn, thisArg) {
  const res = [];
  const arr = this;
  for(let i=0; i<arr.length;i++){
    const tmp = callbackFn.call(thisArg, arr[i], i, arr)
    res.push(tmp)
  }
  return res
}

const insertSort = (arr, start = 0, end) => {
  end = end || arr.length;
  for(let i = start; i < end; i++) {
    let e = arr[i];
    let j;
    for(j = i; j > start && arr[j - 1] > e; j --)
      arr[j] = arr[j-1];
    arr[j] = e;
  }
  return;
}


const readFileThunk = (filename) => {
  return (callback) => {
    fs.readFile(filename, callback);
  }
}

const gen = function* () {
  const data1 = yield readFileThunk('001.txt')
  console.log(data1.toString())
  const data2 = yield readFileThunk('002.txt')
  console.log(data2.toString)
}

let g = gen();
// 第一步: 由于进场是暂停的，我们调用next，让它开始执行。
// next返回值中有一个value值，这个value是yield后面的结果，放在这里也就是是thunk函数生成的定制化函数，里面需要传一个回调函数作为参数
g.next().value((err, data1) => {
  // 第二步: 拿到上一次得到的结果，调用next, 将结果作为参数传入，程序继续执行。
  // 同理，value传入回调
  g.next(data1).value((err, data2) => {
    g.next(data2);
  })
})

function run(gen){
  function next(err,data){
    const tmp = gen.next(data)
    if(tmp.done) return;
    tmp.value(next)
  }
  next()
}

function run(gen){
  const next = (data) =>{
    const res = gen.next(data);
    if(res.done) return;
    res.value.then(value=>next(value))
  }
  next()
}


function myNew(...args){
  const [f, ...restargs] = args;
  const obj = Object.create(f.prototype)
  const res = f.apply(obj, restargs)
  return res instanceof Object ? res : obj
}