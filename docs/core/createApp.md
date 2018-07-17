# `createApp()`

Creates a Stapp application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
  - [Config](#config)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definitions

```typescript
type createApp = (config: {
  name?: string
  modules: Array<Module | ModuleFactory>
  dependencies?: any
  rehydrate?: any
  middlewares?: Middleware[]
}) => Stapp

type Stapp<State, API> = {
  name: string
  subscribe: (state: State) => void
  api: API
  ready: Promise<Partial<State>>
  
  // Imperative and not recommended to use API
  // Still useful for testing
  dispatch: (event: any) => any
  getState: () => State
}
```

## Usage
Create a Stapp application by combining one or more modules with `createApp`:

```javascript
import { createApp } from 'stapp'
import { formBase } from 'stapp-formbase'
import { logger, counter, whatever } from '../modules'

export const app = createApp({
  name: 'My super app',
  modules: [
    formBase,
    logger,
    counter,
    whatever
  ]
})
```

### Config

* **`name`**: Name is not required but recommended if you have more than one app (and you should have more than one app, in other cases, you might not need this library) and use redux-devtools. 
* **`modules`**: See more about modules in the [corresponding section](/usage/modules.html).
* **`dependencies`**: Any function provided as a module will be called with the value of this field.
* **`middlewares`**: An array of any custom redux middlewares.
* **`rehydrate`**: Value provided here, will be used as an initial state in `redux.createStore` method.

## Examples

### Todos

```javascript
// todoModule.js
import { createReducer } from 'stapp'

let id = 0
const uniqueId = () => id++
const todosReducer = createReducer([])

const events = todosReducer.createEvents({
  addTodo: (todos, todo) => todos.concat({id: uniqueId(), completed: false, text: todo }),
  deleteTodo: (todos, id) => todos.filter(todo => todo.id !== id),
  editTodo: (todos, payload) => todos.map(todo => todo.id === payload.id ? {...todo, text: payload.text } : todo),
  toggleComplete: (todos, id) => todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed } : todo),
  removeCompleted: (todos) => todos.filter(todo => !todo.completed)
})

export const todoModule = {
  name: 'todos',
  state: {
    todos: todosReducer
  },
  api: events
}

// todoApp.js
import { createApp } from 'stapp'
import { todoModule } from './todoModule.js'

const todoApp = createApp({
  name: 'Todo',
  modules: [todoModule]
})

todoApp
	.subscribe(state => console.log(`State: ${JSON.stringify(state)}`))
// State: { todos: [] }

todoApp.api.addTodo('Add first todo')
// State: { todos: [
//	{ id: 0, completed: false, text: 'Add first todo' }
// ] }

todoApp.api.editTodo({ id: 0, text: 'Wait, didnt I already did this?'})
// State: { todos: [
//	{ id: 0, completed: false, text: 'Wait, didnt I already did this?' }
// ] }

todoApp.api.toggleComplete(0)
// State: { todos: [
//	{ id: 0, completed: true, text: 'Wait, didnt I already did this?' }
// ] }

todoApp.api.removeCompleted()
// State: { todos: [] }
```

### Todo with undo
Well, you easily can use excellent [`redux-undo`](https://github.com/omnidan/redux-undo) higher order reducer, but where is the fun? This example shows you the real power of epics.

```javascript
// undoModule.js
import { tap, map, mapTo, filter } from 'light-observable/operators'
import { createEvent, combineEpics, dangerouslyReplaceState, selectArray } from 'stapp'

const undo = createEvent('Undo')
const redo = createEvent('Redo')

export const undoModule = () => {
  let prev = []
  let next = []

  // Here we save state changes on every event excepts undo, redo and
  // special Stapp event dangerouslyReplaceState because they
  // will be handled separatly
  const saveStoreEpic = (event$, state$, { getState }) => event$.pipe(
    filter(({ type }) => (
      type !== undo.getType() &&
      type !== redo.getType() &&
      type !== dangerouslyReplaceState.getType()
    )),
    tap(() => {
      prev.push(getState())
      next = []
    }),
    mapTo(null)
  )
 
  // Undo state changes
  const undoEpic = undo.epic((undo$, state$, { getState }) => undo$.pipe(
    filter(() => prev.length > 0),
    tap(() => next.push(getState())),
    map(() => dangerouslyReplaceState(prev.pop()))
  ))

  // Redo state changes
  const redoEpic = redo.epic((redo$, state$) => redo$.pipe(
    filter(() => next.length > 0),
    tap(() => prev.push(getState())),
    map(() => dangerouslyReplaceState(next.pop()))
  ))
  
  // undoModule is made as a function to store prev and next
  // arrays in the closure so that each application will have it's
  // own history.
  return {
    name: 'undo',
    api: {
      undo,
      redo
    },
    epic: combineEpics([
      saveStoreEpic,
      undoEpic,
      redoEpic
    ])
  }
}

// todoApp.js
import { createApp } from 'stapp'
import { todoModule } from './todoModule.js'
import { undo } from './undoModule.js'

const todoApp = createApp({
  name: 'Todo',
  modules: [
    todoModule,
    undoModule()
  ]
})

todoApp.state$
  .subscribe(state => console.log(`State: ${JSON.stringify(state)}`))
// State: { todos: [] }

todoApp.api.addTodo('Add first todo')
// State: { todos: [
//	{ id: 0, completed: false, text: 'Add first todo' }
// ] }

todoApp.api.undo()
// State: { todos: [] }

todoApp.api.redo()
// State: { todos: [
//	{ id: 0, completed: false, text: 'Add first todo' }
// ] }
```

You can explore other examples in the examples section on GitHub.

<!--
## Type definitions

* [`createApp`](/types.html#createApp)
* [`Stapp`](/types.html#stapp)
* [`Module`](/types.html#module)
* [`ModuleFactory`](/types.html#modulefactory)
-->
