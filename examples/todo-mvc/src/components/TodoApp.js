import React from 'react/index'

import { List } from './List'
import { Header } from './Header'
import { Footer } from './Footer'

export const TodoApp = (props) => {
  return <section className="todoapp">
    <Header />
    <List />
    <Footer />
  </section>
}
