function myNew() {
  var constr = Array.prototype.shift.call(arguments);
  var obj = Object.create(constr.prototype);
  var result = constr.apply(obj, arguments);
  return result instanceof Object? result : obj;
}

// 这只能new Function 如何new class呢 里面的super(), super method()需不需要特殊的实现呢，类方法呢
