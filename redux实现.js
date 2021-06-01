// createStore实现
import { createStore, combineReducers } from 'redux';
let { subscribe, dispatch, getState } = createStore(reducer);

const createStore = (reducer,initstate=undefinde) => {
  let state = initstate;
  let listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener)=>{
      listener()
    })
  } 
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l!==listener);
    }
  }
  return { getState, dispatch, subscribe };
}

// reducer拆分

// combineReducers实现
// Reducer 函数负责生成 State。由于整个应用只有一个 State 对象，包含所有数据，对于大型应用来说，这个 State 必然十分庞大，导致 Reducer 函数也十分庞大。

const chatReducer = combineReducers({
  chatLog,
  statusMessage,
  userName
})

const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})

// 等同于
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}
const combineReducers = (reducers) => {
  
}