import React from 'react'
import { Consumer } from '../apps/todoApp'

export const ListItem = ({ todoId }) => {
  const mapper = (state, api) => ({
    todo: state.todos.find(todo => todo.id === todoId),
    handleDblClick: () => {
      return api.handleDblClick(todoId)
    },
    handleDelete: () => api.handleDeleteClick(todoId),
    handleCheckboxClick: () => api.handleCheckboxClick(todoId),
    handleEdit: (event) => {
      if (event.which === 13) {
        api.handleEdit(event, todoId)
      }
    }
  })

  return <Consumer map={mapper}>
    {
      ({
         todo,
         handleDblClick,
         handleEdit,
         handleDelete,
         handleCheckboxClick
       }) => {
        const classNames = []
        todo.completed && classNames.push('completed')
        todo.isEditing && classNames.push('editing')

        return <li className={classNames.join('')}>
          <div className="view">
            <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleCheckboxClick}/>
            <label onDoubleClick={handleDblClick}>{todo.text}</label>
            <button className="destroy" onClick={handleDelete}/>
          </div>
          <input onKeyDown={handleEdit} className="edit"/>
        </li>
      }
    }
  </Consumer>
}
