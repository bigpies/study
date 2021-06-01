// https://juejin.cn/post/6844904077537574919
// 1.比较以下两个Promise的不同之处，参考https://zh.javascript.info/promise-chaining（Promise 链）
new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
}).then(function(result) {
  console.log('result', result); // 1
  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => { console.log('1', result * 2); resolve(result * 2)}, 1000);
  });
}).then(function(result) { // (**)
  console.log('result', result); // 2
  return new Promise((resolve, reject) => {
    setTimeout(() => { console.log('2', result * 2); resolve(result * 2)}, 1000);
  });
}).then(function(result) {
  console.log('result', result); // 4
});

new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
}).then(function(result) {
  console.log('result', result); // 1
  new Promise((resolve, reject) => { // (*)
    setTimeout(() => { console.log('1', result * 2); resolve(result * 2)}, 3000);
  });
  return result * 2
}).then(function(result) { // (**)
  console.log('result', result); // 2
  new Promise((resolve, reject) => {
    setTimeout(() => { console.log('2', result * 2); resolve(result * 2)}, 1000);
  });
  return result * 2
}).then(function(result) {
  console.log('result', result); // 4
});

// 2.实现Promise.prototype.finally的polyfill
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

// 3.
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);


// 4.
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);

// 5.
Promise.resolve().then(() => {
  return new Error('error!!!')
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})

// 6.
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)

// 7.
// 解释
// .then 或者 .catch 的参数期望是函数，传入非函数则会发生值透传。
// 第一个then和第二个then中传入的都不是函数，一个是数字类型，一个是对象类型，因此发生了透传，将resolve(1) 的值直接传到最后一个then里。
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

// 8.
Promise.reject('err!!!')
  .then((res) => {
    console.log('success', res)
  }, (err) => {
    console.log('error', err)
  }).catch(err => {
    console.log('catch', err)
  })

// 8.
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log('start')

// 9.牛皮
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')

// 10. 真牛皮！
const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 end')
  return 'async1 success'
} 
console.log('script start');
async1().then(res => console.log(res));
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)

// async函数中await的new Promise要是没有返回值的话则不执行后面的内容
// .then函数中的参数期待的是函数，如果不是函数的话会发生透传
// 如果在console.log('promise1')后面加上一行 resovle()又会如何

// 11. 真牛皮！
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
// 最后一个定时器打印出的p1其实是.finally的返回值,
// 我们知道.finally的返回值如果在没有抛出错误的情况下默认会是上一个Promise的返回值,
// 而这道题中.finally上一个Promise是.then(),
// 但是这个.then()并没有返回值，所以p1打印出来的Promise的值会是undefined,
// 如果你在定时器的下面加上一个return 1，则值就会变成1。


// 以下为https://juejin.cn/post/6844904077537574919中的8. 几道大厂的面试题，都值得做一做
// 12. 如果我有一个数组[1, 2, 3, 4],如何利用promise，在每隔一秒，输出一个数字。
// 方法一
const arr = [1, 2, 3]
arr.reduce((p, value)=>{
  return p.then(()=>{
    return new Promise((r)=>{
      setTimeout(()=>{
        console.log(value)
        r()
      }, 1000)
    })
  })
}, Promise.resolve())
// 方法二
const arr = [1, 2, 3]
let promise = Promise.resolve()
for(let i=0;i<arr.length;i++){
  promise = promise
    .then(()=>{
      return new Promise(r=>{
        setTimeout(()=>{
          console.log(arr[i])
          r()
        }, 1000)
      })
    })
}

/*
实现mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中。
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

function mergePromise () {
  // 在这里写代码
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
*/

// 方法一
function mergePromise (promises) {
  return new Promise((r)=>{
    const data = []
    promises.reduce((p, value)=>{
      return p.then(()=>{
        return value().then(res=>{
          data.push(res)
          if(data.length === promises.length){ r(data) }
        })
      })
    }, Promise.resolve())
  })
}
// 方法二
function mergePromise (ajaxArray) {
  const data = [];
  let promise = Promise.resolve();
  ajaxArray.forEach(ajax => {
    promise = promise.then(ajax).then(res => {
      data.push(res);
      return data;
    })
  })
  return promise;
}


/*
限制异步操作的并发个数并尽可能快的完成全部
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
function limitLoad(url, handler, limit){
  // 在这里写代码
}

limitLoad(urls, loadImg, 3)
  .then(res => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });
*/
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

// 方法二
function limitLoad(urls, handler, limit){
  return new Promise((r)=>{
    let resolveNum = 0;
    const resolveArr = Array(urls.length)
    let toBeSelect = limit;
    const load = function(index){
      return handler(urls[index])
        .then((res)=>{
          resolveArr[index] = res;
          resolveNum++;
          if(resolveNum === urls.length){
            r(resolveArr)
          }else{
            if(toBeSelect<urls.length){
              load(toBeSelect++)
            }
          }
        })
    }
    for(let i=0;i<limit;i++){
      load(i)
    }
  })
}
