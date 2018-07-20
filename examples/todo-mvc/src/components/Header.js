import React from 'react/index'
import { Consumer } from '../apps/todoApp'

const mapper = (_, api) => ({
  handleSubmit: (event) => {
    if (event.which === 13) {
      api.handleSubmit(event)
      event.target.value = ''
    }
  }
})

export const Header = () => <header className="header">
  <h1>todos</h1>
  <Consumer map={mapper}>
    {
      ({ handleSubmit }) => <input className="new-todo" onKeyPress={handleSubmit} placeholder="What needs to be done?" autoFocus />
    }
  </Consumer>
</header>
