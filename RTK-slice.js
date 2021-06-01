/*
 * @Author: songshupeng
 * @Date: 2020-06-29 18:07:07
 * @LastEditTime: 2020-06-30 11:18:53
 * @LastEditors: songshupeng
 * @FilePath: /basicJSFortest/RTK-slice.js
 */ 
import { createSlice } from '@reduxjs/toolkit'
const todosSlice = createSlice({
  name:'todos',
  initialState:[],
  reducers:{
    addTodo: (state, action) => state.push({
      id: action.id,
      text: action.text,
      completed: false
    }),
    toggleTodo: (state, action) => state.map(todo =>
      todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
    )
  }
})

export const { addTodo, toggleTodo } = todosSlice.actions
export default todosSlice.reducer