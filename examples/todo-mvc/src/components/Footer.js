import React from 'react/index'
import { consume } from '../apps/todoApp'
import { countUncompleted } from '../apps/todoSelectors'

export const Footer = consume(
  state => ({
    count: state.todos.length,
    uncompleted: countUncompleted(state)
  })
)(({
  count,
  uncompleted,
  handleClearClick
}) => {
  const itemWord = uncompleted === 1 ? 'item' : 'items'

  if (count === 0) {
    return null
  }
  return <footer className="footer">
    <span className="todo-count"><strong>{ uncompleted }</strong> { itemWord } left</span>
    {/* <!-- Remove this if you don't implement routing --> */}
    {/*<ul className="filters">*/}
      {/*<li>*/}
        {/*<a className="selected" href="#/">All</a>*/}
      {/*</li>*/}
      {/*<li>*/}
        {/*<a href="#/active">Active</a>*/}
      {/*</li>*/}
      {/*<li>*/}
        {/*<a href="#/completed">Completed</a>*/}
      {/*</li>*/}
    {/*</ul>*/}
    {/* <!-- Hidden if no completed items are left ↓ --> */}
    <button className="clear-completed" onClick={ handleClearClick }>Clear completed</button>
  </footer>
})
