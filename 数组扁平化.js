const arr = [1, [2, [3, 4]]];
const arr1 = [{a:1},1, [2, [3, 4]]];

function flat(arr){
  let res = []
  for(let i=0; i<arr.length; i++){
    if(Array.isArray(arr[i])){
      res = res.concat(flat(arr[i]))
    }else{
      res.push(arr[i])
    }
  }
  return res
}

console.log(flat(arr));
console.log(flat(arr1));

// 对于数组中每一项都是基础数据类型，可以直接使用toString。(有复杂类型则不行)
console.log(arr.toString().split(','));


