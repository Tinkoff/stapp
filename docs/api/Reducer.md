# Reducer

Reducer is a function that takes the previous state and an event and returns a new state. Reducers are created by [`createReducer`](/api/createReducer.html).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
  - [`on()`](#on)
  - [`off()`](#off)
  - [`reset()`](#reset)
  - [`has()`](#has)
  - [`createEvents()`](#createevents)
- [Type definitions](#type-definitions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type AnyEvent = EventCreator | string | Array<EventCreator | string>

type Reducer<State> = {
  (state: State, event: Event): State
  on(event: AnyEvent, handler: EventHandler): Reducer<State>
  off(event: AnyEvent): Reducer<State>
  reset(event: AnyEvent): Reducer<State>
  has(event: EventCreator | string): boolean
  createEvents(model: EventHandlers): EventCreators
}
```

## Usage

### `on()`

Attaches an EventHandler to the reducer. Adding handlers of already existing event types will overwrite previous handlers. Returns reducer.

```js
import { createEvent, createReducer } from 'stapp'

const double = createEvent('Double state')
const add = createEvent('Add value')
const anotherAdd = createEvent('Add string', (x) => +x)

const reducer = createReducer(0)
  .on(double, (state) => state * 2) // Single event creator
  .on([add, anotherAdd], (state, payload) => state + payload) // An array of event creators
  .on('SUBTRACT', (state, payload) => state - payload) // Or a string representing event type
```

### `off()`

Detaches an EventHandler from the reducer. Returns reducer.

```js
reducer.on(double, (state) => {
  if (state > 1000) {
    reducer.off(double)
  }
  return state * 2
})
```

### `reset()`

Attaches a special reset handler to the reducer. Reset handler always returns the initial state.

```js
import { userLogout } from '../../someModule'
reducer.reset(userLogout)
```

### `has()`

Checks if the reducer has a handler for provided event creator or event type.

```js
import { userLogout } from '../../someModule'

reducer.reset(userLogout)
reducer.has(userLogout) // true
```

### `createEvents()`

Creates an object of EventCreators from provided EventHandlers.

```js
const { add, subtract, double } = reducer.createEvents({
  add: (state, payload) => state + payload,
  subtract: (state, payload) => state - payload,
  double: (state) => state * 2
})
```

## Type definitions

- [`createReducer`](/types.html#createreducer)
- [`EventCreator*`](/types.html#eventcreator0)
- [`EventCreators`](/types.html#eventcreators)
- [`EventHandler`](/types.html#eventhandler)
- [`EventHandlers`](/types.html#eventhandlers)
- [`Event`](/types.html#event)