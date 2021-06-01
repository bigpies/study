// 本章主要是讲解lodash的深拷贝，一个简单的深拷贝函数往往只需要不到20行就可以完成，为什么lodash的深拷贝却用了1700行去完成这个功能呢？


// 本章的主要涉及的点有：
// 一
// 属性标志（为二做准备）: 普通属性 v.s. Symbol属性，可枚举 v.s. 不可枚举
// 二
// 属性遍历: 不同引用类型的属性遍历如何统一;
// 属性遍历: 不同遍历方法得到的结果不同（是否能得到：原型链上的，不可枚举的，Symbol类型的）（Object.keys，Object.getOwnPropertyNames，for...in，for...of，Object.getOwnPropertySymbols，Reflect.ownKeys）
// 三
// 循环引用、 封装 => 闭包， 垃圾回收，weakMap
// 四
// 一些特殊对象的处理: Set, Map, Arguments, RegExp, Date, Function, Promise
// 五
// 常用的一些（深浅）拷贝方法

// 先来看看简单版本的: jQuery库中实现继承拷贝的方式
function deepCopy(p, c) {
  var c = c || {};
  for (var i in p) { // Attention！（包括原型链上的）
    if (typeof p[i] === 'object' && p[i] !== null) {
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      // 函数、基本类型(null)
      c[i] = p[i];
    }
  }
  return c;
}

知识准备===start
// 属性标志
// 对象属性（properties），除 value 外，还有三个特殊的特性（attributes），也就是所谓的“标志”：
// writable — 如果为 true，则值可以被修改，否则它是只可读的。
// enumerable — 如果为 true，则会被在循环中列出，否则不会被列出。
// configurable — 如果为 true，则此特性可以被删除，这些属性也可以被修改，否则不可以。

// 查看标志
// Object.getOwnPropertyDescriptor(obj, propertyName);
let user = {
  name: "John"
};
let descriptor = Object.getOwnPropertyDescriptor(user, 'name');
// {
//   "value": "John",
//   "writable": true,
//   "enumerable": true,
//   "configurable": true
// }

// 修改标志
// Object.defineProperty(obj, propertyName, descriptor)
'use strict'
Object.defineProperty(user, "name", {
  writable: false
});
// user.name = "Pete"; // Error: Cannot assign to read only property 'name'


遍历方法对比
// 构造函数
function MakeObj () {
  Object.defineProperties(this, {
    x1: {
      value: 1,
      enumerable: true
    },
    x2: {
      value: 11,
      enumerable: false
    }
  })
}
// 原型对象
Object.defineProperties(MakeObj.prototype, {
  y1: {
    value: 2,
    enumerable: true
  },
  y2: {
    value: 22,
    enumerable: false
  }
})

// 创建实例
var obj = new MakeObj()

// 设置实例对象属性
Object.defineProperties(obj, {
  z1: {
    value: 3,
    enumerable: true
  },
  z2: {
    value: 33,
    enumerable: false
  }
})
Object.keys(obj) // ["x1", "z1"]
Object.getOwnPropertyNames(obj) // ["x1", "x2", "z1", "z2"]

获取Symbol属性值
var ctor = function() {}
var makeSml = key => Symbol(key)
// 原型对象
Object.defineProperties(ctor.prototype, {
  'x1': {
    
  },
  [makeSml('y1')]: {
    value: 2,
    enumerable: true
  },
  [makeSml('y2')]: {
    value: 22,
    enumerable: false
  }
})
var obj = new ctor()

// 设置实例对象属性
Object.defineProperties(obj, {
  [makeSml('z1')]: {
    value: 3,
    enumerable: true
  },
  [makeSml('z2')]: {
    value: 33,
    enumerable: false
  }
})

Object.getOwnPropertySymbols(obj) // [Symbol(z1), Symbol(z2)]

var forIn = []
for (let x in obj) {
  forIn.push(x)
}
forIn // ["x1", "z1", "y1"]
知识准备===end

const targetType = Object.prototype.toString;
const type = targetType.call(obj);
// ECMAScript中的值类型：undefined,null,boolean,number,string,symbol,bigInt
'[object Undefined]'
'[object Null]'
'[object Boolean]'
'[object Number]'
'[object String]'
'[object Symbol]'
'[object BigInt]'
// 如果type的结果等于这些，则是值引用，直接返回

// 引用类型 object及衍生
// 对于此类常见的数组或对象，lodash自己实现了一个ForEach来统一数组和对象的遍历
// 大概是因为需要一个统一的遍历接口，而且数组中的forEach方法的性能表现一般。
// （存疑）Object.prototype 没有类似 forEach 可以遍历对象值的方法，需要配合 Object.prototype.keys 和 for...in 才能实现类似的效果，但是后者性能很差。

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function forEach(array, iteratee) {
  var index = -1,
      length = array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      // 可中断，数组的forEach中使用return只能跳过当前遍历
      break;
    }
  }
  return array;
}

// const unknownObj = {} || []  
const props = Array.isArray(unknownObj) ? undefined : Object.keys(unknownObj)
forEach(props || unknownObj, (subValue, key) => {
  if (props) {
    key = subValue
    subValue = unknownObj[key]
  }
  // todo...
})

循环引用
const a = {
  x: {
    y: 2
  }
}
// 只考虑普通对象
const cloneObj = function (obj) {
  const target = new obj.constructor()
  forEach(Object.keys(obj), (val, key) => {
   key = val
   val = obj[key]
   if (Object.prototype.toString.call(val) === "[object Object]") {
     target[key] = cloneObj(val)
   } else {
     target[key] = val
   }
  })
  return target
}
const b = cloneObj(a) 
// 如果是循环引用呢
const a = {
  x: 1
}
a.x = a
const b = cloneObj(a)

// 解铃还须系铃人 -> a.x === a //true
// 我们将该对象进行缓存，如果在递归中遇到了同一个对象，直接返回即可，这样就终止了递归
var cache = []
var cloneObj = function (obj) {
  var target = new obj.constructor()
  if (cache.includes(obj)) {
    return obj
  }
  cache.push(obj)
  forEach(Object.keys(obj), (val, key) => {
   key = val
   val = obj[key]
   if (Object.prototype.toString.call(val) === "[object Object]") {
     target[key] = cloneObj(val)
   } else {
     target[key] = val
   }
  })
  return target
}

var b = cloneObj(a)
// a === b // false

// 这样只是粗略的完成了任务，其实还是有一些错误和待优化的地方的
// 1.需要声明额外的外部变量=>封装成模块
// 使用闭包，没有了外部变量
var markClone = function () {
  var cache = []
  return function (obj) {
    var target = new obj.constructor()
    if (cache.includes(obj)) {
      return obj
    }
    cache.push(obj)
    forEach(Object.keys(obj), (val, key) => {
     key = val
     val = obj[key]
     if (Object.prototype.toString.call(val) === "[object Object]") {
       target[key] = cloneObj(val)
     } else {
       target[key] = val
     }
    })
    return target
  }
}
var cloneObj = makeClone()
var b = cloneObj(a)


// 2.cache中一致存储了每次克隆和递归过程中的target的值，每一次调用cloneObj都会导致cache的增大（由闭包导致的内存泄漏）
// 改进：作为参数传入,cache的生命周期和函数保持一致，随着函数的消亡而消亡
var cloneObj = function (obj, cache = []) {
  var target = new obj.constructor()
  if (cache.includes(obj)) {
    return obj
  }
  cache.push(obj)
  forEach(Object.keys(obj), (val, key) => {
   key = val
   val = obj[key]
   if (Object.prototype.toString.call(val) === "[object Object]") {
     target[key] = cloneObj(val, cache)
   } else {
     target[key] = val
   }
  })
  return target
}
var b = cloneObj(a)
// 3.看似已经不错了，还有一个致命性的问题，以及一个待优化的问题
// 致命性的问题 : b.x === a b.x保持了a的引用，a的修改会导致b的修改，这就成了浅拷贝
// 待优化的问题 : cache.includes(obj) -> 每次搜索时间复杂度为n
// 引入WeakMap -> 1.什么是weakmap？ 2.map可以吗？（可以）

var cloneObj = function (obj, cache = new WeakMap()) {
  var target = new obj.constructor()
  console.log('target: ', JSON.stringify(target));
  if (cache.has(obj)) {
    console.log('cache.get(obj): ', JSON.stringify(cache.get(obj)));
    return cache.get(obj) 
  }
  cache.set(obj, target) // attention
  forEach(Object.keys(obj), (val, key) => {
   key = val
   val = obj[key]
   if (Object.prototype.toString.call(val) === "[object Object]") {
     // 如果是循环引用，这行类似于 a.x = a，因为此时cloneObj方法返回的是target
     const tmp = cloneObj(val, cache)
     console.log('tmp: ', JSON.stringify(tmp), key);
     target[key] = tmp
   } else {
     target[key] = val
   }
  })
  return target
}

// 一个简单的版本
const sampleClone = function (target, cache = new WeakMap()) {
  // 值类型
  const undefinedTag = '[object Undefined]'
  const nullTag = '[object Null]'
  const boolTag = '[object Boolean]'
  const numberTag = '[object Number]'
  const stringTag = '[object String]'
  const symbolTag = '[object Symbol]'
  const bigIntTag = '[object BigInt]'
  // 引用类型
  const arrayTag = '[object Array]'
  const objectTag = '[object Object]'

  // 传入对象的类型
  const type = Object.prototype.toString.call(target)

  // 所有支持的类型
  const allTypes = [
    undefinedTag, nullTag,boolTag, numberTag, stringTag,symbolTag, bigIntTag, arrayTag, objectTag
  ]

  // 如果是不支持的类型
  if (!allTypes.includes(type)) {
    console.warn(`不支持${type}类型的拷贝，返回{}。`)
    return {}
  }

  // 值类型数组
  const valTypes = [
    undefinedTag, nullTag,boolTag, numberTag, stringTag,symbolTag, bigIntTag
  ]

  // 值类型直接返回
  if (valTypes.includes(type)) {
    return target
  }

  // forEach
  function forEach(array, iteratee) {
    let index = -1
    const length = array.length

    while (++index < length) {
      // 中断遍历
      if (iteratee(array[index], index, array) === false) {
        break
      }
    }
    return array
  }

  // 初始化clone值
  let cloneTarget = new target.constructor()
  // 阻止循环引用
  if (cache.has(target)) {
    return cache.get(target)
  }
  cache.set(target, cloneTarget)

  // 克隆Array 和Object
  const keys = type === arrayTag ? undefined : Object.keys(target)
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value
    }
    cloneTarget[key] = sampleClone(target[key], cache)
  })
  return cloneTarget
}

// 在上面的 sampleClone 中，我们使用了 Object.keys 遍历出「所有」对象上的 key 。
// 但这个所有是存疑的，因为这个方法无法取到原型对象的 key ，也无法取到 Symbol 类型的 key ，也无法遍历出不可枚举的值。

// Lodash通过 isFlat 标识是否拷贝原型对象上的属性，通过 isFull 标识是否拷贝类型为 Symbol 的 key 。
// Lodash只拷贝可枚举的值。
//（一般隐藏原则，在哪看的找一下，todo）

// 1 返回对象上可枚举属性key+原型key的数组
function keysIn(object) {
  const result = []
  for (const key in object) {
    result.push(key)
  }
  return result
}
// 返回对象上可枚举Symbol key的数组
function getSymbols(object) {
  if (object == null) {
    return []
  }
  object = Object(object)
  return Object
    .getOwnPropertySymbols(object)
    .filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol))
}
// 2 返回对象上可枚举属性key + Symbol key的数组
function getAllKeys(object) {
  const result = keys(object)
  if (!Array.isArray(object)) {
    result.push(...getSymbols(object))
  }
  return result
}
// 3
function keys(object) {
  return isArrayLike(object)
    ? arrayLikeKeys(object)
    : Object.keys(Object(object))
}
// The base implementation of `_.keys` which doesn't skip the constructor property of prototypes or treat sparse arrays as dense.
// function baseKeys(object) {
//   return nativeKeys(Object(object));
// }


function getSymbolsIn(object) {
  const result = []
  while (object) {
    result.push(...getSymbols(object))
    object = Object.getPrototypeOf(Object(object))
  }
  return result
}

// 4  返回对象原型链上可枚举（属性key + Symbol key）的数组 
function getAllKeysIn(object) {
  const result = []
  for (const key in object) {
    result.push(key)
  }
  if (!Array.isArray(object)) {
    result.push(...getSymbolsIn(object))
  }
  return result
}
// 通过 isFlat 标识是否拷贝原型对象上的属性，通过 isFull 标识是否拷贝类型为 Symbol 的 key
const keysFunc = isFull
? (isFlat ? getAllKeysIn : getAllKeys)
: (isFlat ? keysIn : keys)



// 进一步完善后的拷贝
const hasOwnProperty = Object.prototype.hasOwnProperty
const getType = Object.prototype.toString


// 获取key的方法
function getKeysFunc(isFull, isFlat) {
  // 判断是否是合法的类数组的length属性
  function isLength(value) {
    return typeof value === 'number' &&
      value > -1 && value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER
  }
  // 判断是否是类数组
  function isArrayLike(value) {
    return value != null && typeof value !== 'function' && isLength(value.length)
  }
  // 判断是否是合法的类数组的index
  function isIndex(value, length) {
    const reIsUint = /^(?:0|[1-9]\d*)$/
    const type = typeof value
    length = length == null ? Number.MAX_SAFE_INTEGER : length

    return !!length &&
      (type === 'number' ||
        (type !== 'symbol' && reIsUint.test(value))) &&
      (value > -1 && value % 1 === 0 && value < length)
  }
  // 是否是arguments
  function isArguments(value) {
    return typeof value === 'object' && value !== null && getType.call(value) === '[object Arguments]'
  }
  // 返回类数组上key组成的数组
  function arrayLikeKeys(value, inherited) {
    const isArr = Array.isArray(value)
    const isArg = !isArr && isArguments(value)
    const skipIndexes = isArr || isArg
    const length = value.length
    const result = new Array(skipIndexes ? length : 0)
    let index = skipIndexes ? -1 : length
    while (++index < length) {
      result[index] = `${index}`
    }
    for (const key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
          // Safari 9 has enumerable `arguments.length` in strict mode.
          (key === 'length' ||
            // Skip index properties.
            isIndex(key, length))
        ))) {
        result.push(key)
      }
    }
    return result
  }

  function keysIn(object) {
    const result = []
    for (const key in object) {
      result.push(key)
    }
    return result
  }

  function getSymbols(object) {
    if (object == null) {
      return []
    }
    object = Object(object)
    return Object
      .getOwnPropertySymbols(object)
      .filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol))
  }

  function getAllKeys(object) {
    const result = keys(object)
    if (!Array.isArray(object)) {
      result.push(...getSymbols(object))
    }
    return result
  }

  function keys(object) {
    return isArrayLike(object)
      ? arrayLikeKeys(object)
      : Object.keys(Object(object))
  }

  function getSymbolsIn(object) {
    const result = []
    while (object) {
      result.push(...getSymbols(object))
      object = Object.getPrototypeOf(Object(object))
    }
    return result
  }

  function getAllKeysIn(object) {
    const result = []
    for (const key in object) {
      result.push(key)
    }
    if (!Array.isArray(object)) {
      result.push(...getSymbolsIn(object))
    }
    return result
  }

  const keysFunc = isFull
  ? (isFlat ? getAllKeysIn : getAllKeys)
  : (isFlat ? keysIn : keys)

  return keysFunc
}

const enhanceClone = function (target, cache = new WeakMap(), isFull = true) {
  // 值类型
  const undefinedTag = '[object Undefined]'
  const nullTag = '[object Null]'
  const boolTag = '[object Boolean]'
  const numberTag = '[object Number]'
  const stringTag = '[object String]'
  const symbolTag = '[object Symbol]'
  const bigIntTag = '[object BigInt]'
  // 引用类型
  const arrayTag = '[object Array]'
  const objectTag = '[object Object]'

  // 传入对象的类型
  const type = getType.call(target)

  // 所有支持的类型
  const allTypes = [
    undefinedTag, nullTag,boolTag, numberTag, stringTag, symbolTag, bigIntTag, arrayTag, objectTag
  ]

  // 如果是不支持的类型
  if (!allTypes.includes(type)) {
    console.warn(`不支持${type}类型的拷贝，返回{}。`)
    return {}
  }

  // 值类型数组
  const valTypes = [
    undefinedTag, nullTag,boolTag, numberTag, stringTag,symbolTag, bigIntTag
  ]

  // 值类型直接返回
  if (valTypes.includes(type)) {
    return target
  }

  // forEach
  function forEach(array, iteratee) {
    let index = -1
    const length = array.length

    while (++index < length) {
      // 中断遍历
      if (iteratee(array[index], index, array) === false) {
        break
      }
    }
    return array
  }

  // 初始化clone值
  let cloneTarget
  if (Array.isArray(target)) {
    const { length } = array
    cloneTarget = new array.constructor(length)
  } else {
    cloneTarget = new target.constructor()
  }
  // 阻止循环引用
  if (cache.has(target)) {
    return cache.get(target)
  }
  cache.set(target, cloneTarget)

  // 确定获取key的方法
  const keysFunc = getKeysFunc(isFull)

  // 克隆Array 和Object
  const keys = type === arrayTag ? undefined : keysFunc(target)
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value
    }
    cloneTarget[key] = enhanceClone(target[key], cache, isFull)
  })

  return cloneTarget
}

// 到了这一步已经非常完善了，剩下的就需要考虑一些非常边缘的case了
// 一些特殊的对象 时间对象 Promise对象 Error对象 RegExp对象
// set map weakmap weakset 
// arguments 类数组
// RegExp#exec生成的数组
// Function
// 二进制数组 arrayBuffer（略）...
// 基础的函数库需要将边缘case考虑的方方面面

// ======插入=======
var reg = /abc/gi
var str = 'abcdabcdabcdabcdabcd'
var res = reg.exec(str)
Array.isArray(res) // true
// 得到的数组多了一些东西 ["abc", index: 0, input: "abcdabcdabcdabcdabcd", groups: undefined] 


const hasOwnProperty = Object.prototype.hasOwnProperty
const getType = Object.prototype.toString


// 初始化一个数组对象，包括正则返回的特殊数组
function initCloneArray(array) {
  const { length } = array
  const result = new array.constructor(length)
  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index
    result.input = array.input
  }
  return result
}

// 获取key的方法
function getKeysFunc(isFull, isFlat) {
  // 判断是否是合法的类数组的length属性
  function isLength(value) {
    return typeof value === 'number' &&
      value > -1 && value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER
  }
  // 判断是否是类数组
  function isArrayLike(value) {
    return value != null && typeof value !== 'function' && isLength(value.length)
  }
  // 判断是否是合法的类数组的index
  function isIndex(value, length) {
    const reIsUint = /^(?:0|[1-9]\d*)$/
    const type = typeof value
    length = length == null ? Number.MAX_SAFE_INTEGER : length

    return !!length &&
      (type === 'number' ||
        (type !== 'symbol' && reIsUint.test(value))) &&
      (value > -1 && value % 1 === 0 && value < length)
  }
  // 是否是arguments
  function isArguments(value) {
    return typeof value === 'object' && value !== null && getType.call(value) === '[object Arguments]'
  }
  // 返回类数组上key组成的数组
  function arrayLikeKeys(value, inherited) {
    const isArr = Array.isArray(value)
    const isArg = !isArr && isArguments(value)
    const skipIndexes = isArr || isArg
    const length = value.length
    const result = new Array(skipIndexes ? length : 0)
    let index = skipIndexes ? -1 : length
    while (++index < length) {
      result[index] = `${index}`
    }
    for (const key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
          // Safari 9 has enumerable `arguments.length` in strict mode.
          (key === 'length' ||
            // Skip index properties.
            isIndex(key, length))
        ))) {
        result.push(key)
      }
    }
    return result
  }

  function keysIn(object) {
    const result = []
    for (const key in object) {
      result.push(key)
    }
    return result
  }

  function getSymbols(object) {
    if (object == null) {
      return []
    }
    object = Object(object)
    return Object
      .getOwnPropertySymbols(object)
      .filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol))
  }

  function getAllKeys(object) {
    const result = keys(object)
    if (!Array.isArray(object)) {
      result.push(...getSymbols(object))
    }
    return result
  }

  function keys(object) {
    return isArrayLike(object)
      ? arrayLikeKeys(object)
      : Object.keys(Object(object))
  }

  function getSymbolsIn(object) {
    const result = []
    while (object) {
      result.push(...getSymbols(object))
      object = Object.getPrototypeOf(Object(object))
    }
    return result
  }

  function getAllKeysIn(object) {
    const result = []
    for (const key in object) {
      result.push(key)
    }
    if (!Array.isArray(object)) {
      result.push(...getSymbolsIn(object))
    }
    return result
  }

  const keysFunc = isFull
  ? (isFlat ? getAllKeysIn : getAllKeys)
  : (isFlat ? keysIn : keys)

  return keysFunc
}

// 拷贝正则对象
function cloneRegExp(regexp) {
  const result = new regexp.constructor(regexp.source, regexp.flags)
  result.lastIndex = regexp.lastIndex
  return result
}

// 拷贝arguments对象

function cloneArguments(args) {
  const result = (function(){return arguments})()
  result.callee = args.callee
  result.length = args.length
  return result
}

const cloneDeep = function (target, isFull = true, cache = new WeakMap(), parent) {
  // 值类型
  const undefinedTag = '[object Undefined]'
  const nullTag = '[object Null]'
  const boolTag = '[object Boolean]'
  const numberTag = '[object Number]'
  const stringTag = '[object String]'
  const symbolTag = '[object Symbol]'
  const bigIntTag = '[object BigInt]'
  // 引用类型
  const arrayTag = '[object Array]'
  const objectTag = '[object Object]'
  const setTag = '[object Set]'
  const mapTag = '[object Map]'
  const argTag = '[object Arguments]'
  const regexpTag = '[object RegExp]'
  const dateTag = '[object Date]'
  const funcTag = '[object Function]'
  const promiseTag = '[object Promise]'
  // 无法拷贝的引用类型
  const weakMapTag = '[object WeakMap]'
  const weakSetTag = '[object WeakSet]'
  const errorTag = '[object Error]'

  // 传入对象的类型
  const type = getType.call(target)

  // 所有支持的类型
  const allTypes = [
    undefinedTag, nullTag,boolTag, numberTag, stringTag, symbolTag, bigIntTag, arrayTag, objectTag,
    setTag, mapTag, argTag, regexpTag, dateTag, funcTag, promiseTag,
    weakMapTag, weakSetTag, errorTag
  ]

  // 如果是不支持的类型
  if (!allTypes.includes(type)) {
    console.warn(`不支持${type}类型的拷贝，返回{}。`)
    return {}
  }

  // 值类型数组
  const valTypes = [
    undefinedTag, nullTag,boolTag, numberTag, stringTag,symbolTag, bigIntTag
  ]
  // 值类型直接返回
  if (valTypes.includes(type)) {
    return target
  }

  // forEach
  function forEach(array, iteratee) {
    let index = -1
    const length = array.length

    while (++index < length) {
      // 中断遍历
      if (iteratee(array[index], index, array) === false) {
        break
      }
    }
    return array
  }

  // 初始化clone值
  let cloneTarget
  if (Array.isArray(target)) {
    cloneTarget = initCloneArray(target)
  } else {
    switch (type) {
      case argTag:
        cloneTarget = cloneArguments(target)
        break
      case regexpTag:
        cloneTarget = cloneRegExp(target)
        break
      case dateTag:
        cloneTarget = new target.constructor(+target)
        break
      case funcTag:
        cloneTarget = parent ? target : {}
        break
      // promise存储的是当前的状态，如果在 then 方法中不对当前状态做任何处理，那么它会返回一个保存当前状态的新的实例对象。
      // 所以拷贝 Promise ，调用它的 then 方法，然后什么也不做就行了。
      case promiseTag:
        cloneTarget = target.then()
        break
      case weakMapTag:
      case weakSetTag:
      case errorTag:
        !parent && console.warn(`${type}类型无法拷贝，返回{}。`)
        cloneTarget = parent ? target : {}
        break
      default:
        cloneTarget = new target.constructor()
    }
  }
  // 阻止循环引用
  if (cache.has(target)) {
    return cache.get(target)
  }
  cache.set(target, cloneTarget)

  // emmm...有点小瑕疵
  // 克隆set
  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(cloneDeep(value, cache))
    })
    return cloneTarget
  }
  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, cloneDeep(value, cache))
    })
    return cloneTarget
  }

  // 确定获取key的方法
  const keysFunc = getKeysFunc(isFull)

  // 克隆Array 和Object
  const keys = type === arrayTag ? undefined : keysFunc(target)
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value
    }
    cloneTarget[key] = cloneDeep(target[key], isFull, cache, target)
  })

  return cloneTarget
}


// 日常中我们经常会使用的（深浅）拷贝有哪些呢？


let obj1 = { ...obj }; //浅拷贝
let obj2 = JSON.parse(JSON.stringify(obj)) //深拷贝
let obj3 = Object.assign({}, obj) //浅拷贝

let arr1 = [...arr]; //浅拷贝
let arr2 = JSON.parse(JSON.stringify(arr)) //深拷贝 （只拷贝本对象上，常规可枚举属性）
let arr3 = arr.slice(arr); //浅拷贝 

// JSON.parse(JSON.stringify()) 虽然使用方便，但是也有一些限制
// 只是通常我们的业务中没有这些场景，所以感知不强，但还是要在使用的时候提醒自己呀！
// JSON 是语言无关的纯数据规范!!!  -> 这导致了一些特定的javascript对象属性会被JSON.stringify()跳过
    // 函数属性（方法）。
    // Symbol 类型的属性。
    // 存储 undefined 的属性。
let a = {
  sayHi() {
    alert("Hello");
  },
  [Symbol("id")]: 123,
  something: undefined,
};
let res = JSON.parse(JSON.stringify(a))
// res = {}

// JSON方法禁止循环引用，Uncaught TypeError: Converting circular structure to JSON
let a = { 
  x: 1,
  b: 2,
}
a.x = a
let res = JSON.parse(JSON.stringify(a))

// 冷门用法  let json = JSON.stringify(value[, replacer, space]) 
// replacer 默认为null，space默认为2
JSON.stringify(a, function replacer(key, value) {
  return (key == 'x') ? undefined : value;
})



