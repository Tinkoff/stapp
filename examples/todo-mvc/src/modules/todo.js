import { createReducer } from 'stapp'
import { everythingToggled } from '../apps/todoSelectors'

const todosReducer = createReducer([])

// This events could be passed to store directly
// but that would be sort of messy
// Instead this events should be imported and used by other modules.
export const events = todosReducer.createEvents({
  addTodo: (todos, newTodo) => todos.concat({id: +(new Date()), completed: false, isEditing: false, text: newTodo }),
  deleteTodo: (todos, id) => todos.filter(todo => todo.id !== id),
  editTodo: (todos, payload) => todos.map(todo => todo.id === payload.id ? {...todo, text: payload.text, isEditing: false } : todo),
  toggleComplete: (todos, id) => todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed } : todo),
  toggleEditing: (todos, id) => todos.map(todo => todo.id === id ? {...todo, isEditing: !todo.isEditing } : todo),
  toggleAll: (todos) => {
    const nextState = everythingToggled({ todos })

    return todos.map(todo => ({ ...todo, completed: !nextState }))
  },
  clearCompleted: (todos) => todos.filter(todo => !todo.completed)
})

export const todoModule = ({
  name: 'todos',
  reducers: {
    todos: todosReducer
  }
})
