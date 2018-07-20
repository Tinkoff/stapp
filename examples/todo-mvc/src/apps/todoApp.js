import { createApp } from 'stapp'
import { createComponents } from 'stapp-react'
import { persist, toAsync } from 'stapp-persist'
import { handlers } from '../modules/handlers'
import { todoModule } from '../modules/todo'

const todoApp = createApp({
  name: 'todo',
  modules: [
    todoModule,
    persist({
      key: 'todo',
      storage: toAsync(localStorage)
    }),
    handlers
  ]
})

export const { Consumer, consume } = createComponents(todoApp)
