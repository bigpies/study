// 1.========实现数组扁平化（普通方法和generator）
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  for(let i=0;i<a.length; i++){
    if(typeof a[i] === 'number'){
      yield a[i]
    }
    yield* flat(a[i])
  }
};
for (var f of flat(arr)){
  console.log(f);
}