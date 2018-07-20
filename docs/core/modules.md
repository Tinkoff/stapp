# Modules

CreateApp itself doesn't do much work. It sets up a redux store, a couple of middlewares and returns a Stapp object. Without modules, application api will be empty, and its state will be a plain empty object. Like, forever.

So, what are the modules? A module is a place where all your magic should happen. A module has an ability to:

1. create and handle portions of an app state;
2. provide methods to a public application api;
3. react to state changes;
4. react to api calls.

A basic module is an object or a function, returning an object.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Modules: handling state](#modules-handling-state)
- [Modules: events](#modules-events)
  - [User interactions](#user-interactions)
  - [Modules logic](#modules-logic)
  - [Testing](#testing)
- [Modules: epics](#modules-epics)
- [Modules: module factories](#modules-module-factories)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Definition

```typescript
type Module<Api, State, FullState = State> = {
  name: string
  dependencies?: string[]

  // Api
  api?: Api
  events?: Api // Alias for api
  waitFor?: Array<
    | AnyEventCreator
    | string
    | {
      event: AnyEventCreator | string
      timeout: number
    }>

  // State
  state?: { [K: string]: Reducer<State[K]> }
  reducers?: { [K: string]: Reducer<State[K]> } // alias for state

  // Epics
  epic?: Epic<Partial<Full>>
}
```

## Modules: handling state

Since Stapp uses redux as a state management core, reducers and events are the familiar redux concepts.

Reducer is a pure function, that receives an old state and an event, and must return a new state. An event (or an 'action' in redux terminology) is a plain object with only one required field `type`. Stapp follows [flux-standard-action](https://github.com/redux-utilities/flux-standard-action#actions) convention.

Stapp provides some useful tools to simplify creating of reducers and event creators. These tools are
inspired by redux-act, but have some tweaks and API differences to make the process even simpler.

Here is an example:

```typescript
import { createEvent, createReducer } from 'stapp'

const setValue = createEvent('Set value')
const clearValue = createEvent('Clear value')
const setError = createEvent('Set errror')
const reset = createEvent('Reset state')

const valuesReducer = createReducer({})
  .on(setValue, (values, newValues) => ({ ...values, ...newValues }))
  .on(clearValue, (values, fieldName) => ({ ...values, [fieldName]: null }))
  .reset(reset)

const errorsReducer = createReducer({})
  .on(setError, (errors, newErrors) => ({ ...errros, ...newErrors }))
  .reset(reset)

const formBase = {
  name: FORM_BASE,
  state: { // or `reducers`
    values: valuesReducer,
    errors: errorsReducer
  }
}
```

A reducer created by createReducer is a function with some additional methods. Still, these reducers are just functions, so they can be combined into one with redux `combineReducers` method. And remember, you are not forced to use createReducer at all.

Value of `state` (or `reducers`) fields of every module in the app will be merged into one object and combined into one root reducer, constructing the whole state of an app.

## Modules: events

There are several ways to dispatch events to the store - each for its case.

> If you are familiar with redux, you might ask: — Why do we call actions "events"? See, Flux and, specifically, redux borrowed much from CQRS and Event Sourcing patterns. Using the term "event" instead of "action" prompts to treat redux actions not only as commands to execute but also as events. Still, it's just an opinion, and you may use any tools compatible with flux-standard-action.

### User interactions

If a module needs to handle some user interactions, it can add methods to the application's public API.
Any event creators passed through an `api` field, will be bound to the store and exposed to an application consumer as API methods.

```typescript
import { createEvent } from 'stapp'

export const formBase = {
  name: FORM_BASE,
  api: { // or `events`
    setValue: createEvent('Set new values')
  }
}
```

```html
// somewhere later
<input name='example' onchange='event => api.setValue({
  example: event.target.value
})' />
```

`api` object can be nested:
```typescript
import { createEvent } from 'stapp'

export const formBase = {
  name: FORM_BASE,
  api: { // or `events`
    formBase: {
      setValue: createEvent('Set new values'),
      setError: createEvent('Set error')
    }
  }
}

// later
app.api.formBase.setValue(/* */)
app.api.formBase.setError(/* */)
```

### Modules logic

All other events needed for business logic should not be exposed to the public API. Instead, they should be dispatched by so-called epics. The concept of epics will be explained below.

### Testing

The application object created with `createApp` has `dispatch` and `getState` methods. Although these methods can be used anywhere, the only reason to have them is that they are beneficial in unit tests. So please don't use them anywhere except tests.

## Modules: epics

Epic is one the core concepts, which makes your application reactive. Epic can *react* to anything that happens with the application, and it should be the only place containing business-logic.

Epic is a function, that receives a stream of events and a stream of state, and must return a stream of events. The concept of epics is well explained [here](https://redux-observable.js.org/docs/basics/Epics.html).

The only difference between redux-observable epics and Stapp epics is that the latter accepts a stream of a state as the last argument.

Here is an example of an epic:

```typescript
import { map, filter } from 'light-observable/operators'
import { select, combineEpics, createEvent } from 'stapp'
import { setValue } from 'stapp-formbase'

const handleChange = createEvent('handle input change', event => ({
  [event.target.name]: event.target.value
}))

const handleChangeEpic = (event$) => event$.pipe(
  filter(select(handleChange)),
  map(({ payload }) => setValue(payload))
)

const form = {
  name: 'form',
  api: { handleChange },
  epic: combineEpics([handleChangeEpic])
}
```

Each module can provide only one epic, but you can create as many as you like - and combine them into one with `combineEpics` function.

See more about Epics in the [Epics section](/usage/ epics.html).

## Modules: module factories

A module factory is a function that returns a module. You'll find out at some point that most of your modules are module factories. 

Sometimes your modules might have some common dependencies. E.g., a request service. Instead of passing them directly into a module, you should pass dependencies to the `dependencies` field of `createApp` config.

Every function passed to the `modules` field will be called with a value provided to the `dependencies` field.

```typescript
// moduleA.js
import { select } from 'stapp'
import { switchMap, map, filter } from 'light-observable/operators'

import { request } from 'my-services'

const moduleA = ({ request }) => ({
  epic: (event$) => event$.pipe(
    filter(select(someEvent)),
    switchMap(({ payload }) => request('/my-cool-api', payload)),
    map(result => someOtherEvent(result))
  )
})    

// my-app.js
const app = createApp({
  name: 'my app',
  modules: [
    moduleA
  ],
  dependencies: {
    request
  }
})
```
<!--
## Type definitions

- [`createApp`](/types.html#createApp)
- [`Module`](/types.html#module)
- [`ModuleFactory`](/types.html#modulefactory)
-->
