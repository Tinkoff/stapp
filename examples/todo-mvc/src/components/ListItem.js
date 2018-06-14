import React from 'react/index'
import { consume } from '../apps/todoApp'

export const ListItem = consume(
  (state, { todoId }) => state.todos.find(todo => todo.id === todoId),
  (api, { todoId }) => ({
    ...api,
    handleDblClick: () => api.handleDblClick(todoId),
    handleDelete: () => api.handleDeleteClick(todoId),
    handleCheckboxClick: () => api.handleCheckboxClick(todoId),
    handleEdit: (event) => {
      if (event.which === 13) {
        api.handleEdit(event, todoId)
      }
    }
  })
)(({
  id,
  text,
  completed,
  isEditing,
  handleDblClick,
  handleEdit,
  handleDelete,
  handleCheckboxClick
}) => {
  const classNames = []
  completed && classNames.push('completed')
  isEditing && classNames.push('editing')

  return <li className={ classNames.join('') }>
    <div className="view">
      <input className="toggle" type="checkbox" checked={ completed } onChange={ handleCheckboxClick } />
      <label onDoubleClick={ handleDblClick }>{ text }</label>
      <button className="destroy" onClick={ handleDelete } />
    </div>
    <input onKeyDown={ handleEdit } className="edit" />
  </li>
})
