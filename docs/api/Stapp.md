# Stapp

`Stapp` is an application created with [`createApp`](/api/createApp.html).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
- [Examples](#examples)
  - [Todos](#todos)
  - [Todo with undo](#todo-with-undo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type Stapp<State, API> = {
  name: string
  state$: Observable<State>
  api: API
  
  // Imperative and not recommended to use API
  // Still useful for testing
  dispatch: (event: any) => any
  getState: () => State
}
```

## Usage

You create a Stapp application by combining one or more modules with `createApp`:

```javascript
import { createApp } from 'stapp'
import { formBase } from 'stapp/lib/modules/formBase'
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
	.state$
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
import { tap, map, mapTo, sample, withLatestFrom, filter } from 'rxjs/operators'
import { createEvent, combineEpics, dangerouslyReplaceState } from 'stapp'

const undo = createEvent('Undo')
const redo = createEvent('Redo')

export const undoModule = () => {
  let prev = []
  let next = []

  // Here we save state changes on every event excepts undo, redo and
  // special Stapp event dangerouslyReplaceState because they
  // will be handled separatly
  const saveStoreEpic = (event$, state$) => state$.pipe(
    sample(event$.pipe(
    filter(({ type }) => {
      return type !== undo.getType()
        && type !== redo.getType()
        && type !== dangerouslyReplaceState.getType()
      })
    )),
    tap(state => {
      prev.push(state)
      next = []
    }),
    mapTo(null)
  )

  // Undo state changes
  const undoEpic = undo.epic((undo$, state$) => state$.pipe(
    sample(undo$),
    filter(() => prev.length > 0),
    tap(state => next.push(state)),
    map(() => prev.pop()), // oh, lovely mutations
    map(prevState => dangerouslyReplaceState(prevState))
  ))

  // Redo state changes
  const redoEpic = redo.epic((redo$, state$) => state$.pipe(
    sample(redo$),
    filter(() => next.length > 0),
    tap(state => prev.push(state)),
    map(() => next.pop()),
    map(nextState => dangerouslyReplaceState(prevState))
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
