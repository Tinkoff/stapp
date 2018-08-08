# Select
`stapp-select` utilizes the provided `selector` function when any of provided `reactOn` event is dispatched,
stores the result at the provided field `name` in the app state and dispatches `reactWith` events is provided.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
  - [`name`](#name)
  - [`reactOn`](#reacton)
  - [`selector`](#selector)
  - [`reactWith`](#reactwith)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type select = <State, Result, Name extends string>(
  config: {
    name: Name
    selector: (state: State) => Result
    reactOn: Array<AnyEventCreator | string>
    reactWith?: Array<EventCreator1<Result>>
  }
) => Module<{}, { [K in Name]: Result }>
```

## Usage
Example usage: dynamic form with fields depending on authorization state.

```js
import { createApp } from 'stapp'
import { formBase } from 'stapp-formbase'
import { select } from 'stapp-select'
import { authModule, authChange } from '../modules/'

const app = createApp({
  name: 'My Form App',
  modules: [
    select({
      name: 'fields',
      reactOn: [authChange],
      selector: state => {
         return state.auth.isAuthorized
          ? ['fieldA', 'fieldB'] 
          : ['name', 'email', 'fieldA', 'fieldB']
      }
    }),
    formBase(),
    authModule()
  ]
})

console.log(app.getState().fields)
// -> 'name', 'email', 'fieldA', 'fieldB'

app.api.authorize({ ... })
console.log(app.getState().fields)
// ->'fieldA', 'fieldB'
```

### `name`
`name` defines where to place the selected data in the app state. You can add several select modules to app with different names.

### `reactOn`
An array of event creators or event types. Module will update (call the `selector` and save the result) stored data when any of these events emits. 

### `selector`
Receives state, can return anything. Result will be stored in the provided field name.

### `reactWith`
An optional array of event creators. These events will be dispatched immediately after data update with the `selector` result as a payload.
