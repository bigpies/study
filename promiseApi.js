// 练习题
// https://juejin.cn/post/6844904077537574919
// 手写promise
// https://juejin.cn/post/6844903872842956814


// https://segmentfault.com/a/1190000021281507 -> https://github.com/dongyuanxin/diy-promise

// 实现 Promise.all
// 如果传入的所有 promise 实例的状态均变为fulfilled，那么返回的 promise 实例的状态就是fulfilled，
// 并且其 value 是 传入的所有 promise 的 value 组成的数组。
// 如果有一个 promise 实例状态变为了rejected，那么返回的 promise 实例的状态立即变为rejected。
Promise.myAll = function(iterators) {
  const promises = Array.from(iterators);
  const num = promises.length;
  const resolvedList = new Array(num);
  let resolvedNum = 0;

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise) //注意此处即可
        .then(value => {
          // 保存这个promise实例的value
          resolvedList[index] = value;
          // 通过计数器，标记是否所有实例均 fulfilled
          if (++resolvedNum === num) {
            resolve(resolvedList);
          }
        })
        .catch(reject);
    });
  });
};

// 实现 Promise.race
// Promise.race(iterators)的传参和返回值与Promise.all相同。但其返回的 promise 的实例的状态和 value，完全取决于：
// 传入的所有 promise 实例中，最先改变状态那个（不论是fulfilled还是rejected）。

Promise.myRace = function(iterators) {
  const promises = Array.from(iterators);

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch(reject);
    });
  });
};

// 实现 Promise.any-> 和Promise.all类似
// 如果传入的实例中，有任一实例变为fulfilled，那么它返回的 promise 实例状态立即变为fulfilled；
// 如果所有实例均变为rejected，那么它返回的 promise 实例状态为rejected。

// 实现 Promise.allSettled
// 此返回的 promise 实例的状态只能是fulfilled。
// 对于传入的所有 promise 实例，会等待每个 promise 实例结束，并且返回规定的数据格式。
// 如果传入 a、b 两个 promise 实例：a 变为 rejected，错误是 error1；b 变为 fulfilled，value 是 1。
// 那么Promise.allSettled返回的 promise 实例的 value 就是：
[{ status: "rejected", value: error1 }, { status: "fulfilled", value: 1 }];



// 实现Promise.prototype.finally
// 成功透传 value，失败透传 error
Promise.prototype.finally = function(cb) {
  return this.then(
    value => Promise.resolve(cb()).then(() => value),
    error =>
      Promise.resolve(cb()).then(() => {
        throw error;
      })
  );
};