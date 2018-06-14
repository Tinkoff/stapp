import React, { Component } from 'react/index'
import { OverallFooter } from './OverallFooter'
import { TodoApp } from './TodoApp'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <TodoApp />
        <OverallFooter />
      </React.Fragment>
    )
  }
}

export default App
