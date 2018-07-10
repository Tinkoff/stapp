# `createReducer()`

Creates a [Reducer](/api/Reducer.html) on steroids.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type createReducer = (
  initialState: any,
  handlers: EventHandlers = {}
) => Reducer
```

## Usage

```JS
import { createEvent, createReducer } from 'stapp'

const increment = createEvent()
const reducer = createReducer(0)
  .on(increment, state => state + 1)

const state = reducer() // 0
const nextState = reducer(state, increment) // 1
```

See [Reducer](/api/Reducer.html) docs section for more examples.

<!--
## Type definitions

* [`createReducer`](/types.html#createReducer)
* [`Reducer`](/types.html#reducer)
-->
