import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();
// store
// 一个应用只能有一个Store--尝试：如果是两个呢？
const store = createStore(reducer, applyMiddleware(logger));


// state
// 当前时刻的state通过store.getState拿到
const state = store.getState();

// Action
const action = {
  type: 'ADD_TODO',
  paylaod: 'something else',
}

// Action Creator
const ADD_TODO = 'ADD_TODO';
function addTodo(paylaod){
  return{
    type: ADD_TODO,
    paylaod,
  }
}
const action1 = addTodo('Oooops!');

// store.dispatch
store.dispatch(action1)

// reducer
// store收到Action以后,需要给出一个新的State，这样View才会发生变化，这种State的计算过程就叫做Reducer
const initState = {}
const reducer = function(state = initState, action){
  switch(action.type) {
    case ADD_TODO:
      return state.set('todo',action.payload);
    default:
      return state;
  }
}

// store.subscribe
// 一旦State发生变化，就自动执行这个函数
// 显然，只要把View的更新函数（render, setState）放入listen，就会实现View的自动渲染
const unsubscribe = store.subscribe(listener);
// 取消监听
unsubscribe()


