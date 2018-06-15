import { createSelector } from "reselect"

export const idsSelector = createSelector(
  state => state.todos,
  (todos) => ({ ids: todos.map(todo => todo.id) })
)
export const showToggleSelector = (state) => state.todos.length > 0
export const everythingToggled = (state) => state.todos.every(todo => todo.completed)
export const countUncompleted = (state) => state.todos.filter(todo => !todo.completed).length
export const toggleSelector = createSelector(
  showToggleSelector,
  everythingToggled,
  (showToggle, isToggled) => ({ showToggle, isToggled })
)

