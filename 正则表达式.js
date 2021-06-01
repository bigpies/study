// 什么是模式，什么是修饰符？
// str.search() 返回index，没匹配到返回-1
// str.match()  返回匹配项，多个维数组，没匹配到为null
// str.replace() 返回替换后的值


// 常用字符类
// \d \s \w

// 反向类
// \D \S \W

// 通配符 .

// Unicode属性 \p{...}
// \p{Letter} => \p{L}表示任何语言中的一个字母。

// 锚点（Anchors)
// 字符串开始 ^ 和末尾 $

// 词边界 \b （词边界 \b 不适用于非拉丁字母）

// 特殊字符列表 [ \ ^ $ . | ? * + ( )


// 集合和范围 [...]
// 排除范围 [^...]



// 双重含义 
// ^   .   ?


function parse(str){
  const res = str.match(/\s*(-?\d+(?:\.\d+)?)/)
  return [res[1], res[2], res[3]]
}

function parse(str){
  const res = str.match(/\s*(-?\d+(?:\.\d+)?)\s*([+-*\/])\s*(-?\d+(?:\.\d+)?)\s*/)
  return [res[1], res[2], res[3]]
}

// /(-?\d+(?:\.\d+)?)\s*([-+*\/])\s*(-?\d+(?:\.\d+)?)/
// /(-?\d+(?:\.\d+)?)\s*([-+*\/])\s*(-?\d+(?:\.\d+)?)/