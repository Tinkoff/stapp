import React from 'react/index'
import { consume } from '../apps/todoApp'

export const Header = consume(
  undefined,
  (api) => ({
    handleSubmit: (event) => {
      if (event.which === 13) {
        api.handleSubmit(event)
        event.target.value = ''
      }
    }
  })
)(({
  handleSubmit
}) => <header className="header">
  <h1>todos</h1>
  <input className="new-todo" onKeyPress={handleSubmit} placeholder="What needs to be done?" autoFocus />
</header>)
