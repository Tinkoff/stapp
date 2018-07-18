import React from 'react'

import { List } from './List'
import { Header } from './Header'
import { Footer } from './Footer'

export const TodoApp = () => {
  return <section className="todoapp">
    <Header />
    <List />
    <Footer />
  </section>
}
