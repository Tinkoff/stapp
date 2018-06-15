import { createApp } from 'stapp'
import { createConsumer, createConsume } from 'stapp/lib/react/index'
import { persist, toAsync } from 'stapp/lib/modules/persist'
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

export const Consumer = createConsumer(todoApp)
export const consume = createConsume(todoApp)
