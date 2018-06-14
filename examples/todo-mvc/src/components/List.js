import React from 'react/index'
import { Consumer } from '../apps/todoApp'
import { ListItem } from './ListItem'
import { idsSelector, toggleSelector } from '../apps/todoSelectors'

export const List = () => {
  return <section className="main">
    <Consumer mapState={toggleSelector}>
      {
        ({ state: { showToggle, isToggled }, api: { handleToggleClick } }) => showToggle ?
          <React.Fragment>
            <input id="toggleAll" className="toggle-all" type="checkbox" checked={ isToggled } onChange={ handleToggleClick } />
            <label htmlFor="toggleAll">Mark all as complete</label>
          </React.Fragment> :
          null
      }
    </Consumer>

    <ul className="todo-list">
      <Consumer mapState={idsSelector}>
        {
          ({ state: ids }) => ids.map(id => <ListItem
            todoId={ id }
            key={ id }
          />)
        }
      </Consumer>
    </ul>
  </section>
}
