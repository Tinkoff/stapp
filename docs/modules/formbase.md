# FormBase

`stapp-formbase` module handles almost everything that you may need to build a form application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [Peer dependencies](#peer-dependencies)
- [Definition](#definition)
- [Usage](#usage)
  - [State fields and events explanation](#state-fields-and-events-explanation)
  - [Events](#events)
  - [Selectors](#selectors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
```bash
npm install stapp-formbase stapp reselect
# OR using stapp-cli-tools
stapp install stapp-formbase
```

### Peer dependencies
* **stapp**: >= 2.6
* **reselect**: >= 4

## Definition

```typescript
type formBase<Values> = (config: {
  initialValues: Partial<Values>
}) => Module<{}, FormBaseState<Values>>

type FormBaseState<Values> = {
  values: Values,
  errors: { [K in keyof Values]: any },
  touched: { [K in keyof Values]: boolean },
  dirty: { [K in keyof Values]: boolean },
  active: keyof Values | null,
  ready: { [K: string]: boolean },
  pristine: boolean,
  submitting: boolean
}
```

## Usage

```js
import { createApp } from 'stapp'
import { formBase } from 'stapp-formbase'

const app = createApp({
  name: 'My Form',
  modules: [
    formBase({
      initialValues: {
        name: 'Evan',
        age: 16
      }
    })
  ]
})
```

### State fields and events explanation

* **`values`**: `{ [fieldName]: fieldValue}`. Value preferably should be of a string type. Related:
  * `setValue` event:  sets values.
  * `resetForm` event: sets values back to initial.
  * `clearFields` event: removes values for fields listed in the payload.
  * `pickFields` event: removes values for fields NOT listed in the payload.
  
* **`errors`**: `{ [fieldName]: fieldError} `. Value of any type can be an error. Related:
  * `setError` event: sets errors.
  * `resetForm` event: clears all errors.
  * `isValidSelector` selector creator: creates a selector that returnes `true` if there is no errors, `false ` otherwise.
  * `clearFields` event: removes errors for fields listed in the payload.
  * `pickFields` event: removes errors for fields NOT listed in the payload.

* **`touched`**: `{ [fieldName]: boolean }`. Indicates that a field was active at some time. Related:
  * `setTouched` event: sets fields as touched. Should be called on `blur` events.
  * `resetForm` event: clears `touched` state.
  * `clearFields` event: removes values for fields listed in the payload.
  * `pickFields` event: removes values for fields NOT listed in the payload.

* **`active`**: `string | null` . Indicates currently active (focused) field. Related:
  * `setActive` event: sets a field as active.
  * `resetForm` event: sets `active` to `null`.
  * `clearFields` event: sets `active` to `null` if active field is listed in the payload.
  * `pickFields` event: sets `active` to `null` if active field is NOT listed in the payload.

* **`dirty`**: `{ [fieldName]: boolean}`. Field is dirty if its value differs from initial value. Related:
  * `setValue` event: sets values.
  * `resetForm` event: clears `dirty` state.
  * `clearFields` event: removes values for fields listed in the payload.
  * `pickFields` event: removes values for fields NOT listed in the payload.
  * `isDirtySelector` selector creator: creates a selector that returns `false` if form values state equals to initial state, `true` otherwise.

* **`pristine`**: `boolean`. Indicates that a user has ever interacted with a form. Related:
  * `setValue` event: sets `pristine` value to `false`.
  * `setTouched` event: sets `pristine` value to `false`.
  * `resetForm` event: sets `pristine` falue to `true`
  * `clearFields` event: removes values for fields listed in the payload.
  * `pickFields` event: removes values for fields NOT listed in the payload.
  * `isPrisineSelector` selector creator: creates a selector that returns `pristine` value.

* **`ready`**: `{ [K: string]: boolean }`. Can be used to set readiness flags. Used for validation, async requests etc. Related:
  * `setReady` event: sets readiness flags.
  * `resetForm` event: clears `ready` state.
  * `isReadySelector` selector creator: creates a selector that returns `true` if all readiness flags are `true`, `false` otherwise.

* **`submitting`**: `boolean`. Indicates that a form is being submitted. Related:
  * `setSubmitting` event: sets submitting to `true` or `false`

### Events

`stapp-formbase` exposes every event to the public application API.
Events are available in the `formBase` field of an `api` object.

```typescript
type setValue = EventCreator<{ [K: string]: string }>
type setError = EventCreator<{ [K: string]: any }>
type setTouched = EventCreator<{ [K: string]: boolean }> 
type setActive = EventCreator<string>
type setSubmitting = EventCreator<boolean>
type setReady = EventCreator<{ [K: string]: boolean }> 
type clearFields = EventCreator<string[]> 
type pickFields = EventCreator<string[]> 
type setReady = EventCreator<{ [K: string]: boolean }> 
type resetForm = EventCreator<void>
type submit = EventCreator<void>
```

### Selectors

`stapp-formbase` is shipped with a bunch of memoized selectors.

```typescript
type fieldSelector = <State, Extra>(name: string, extraSelector: (state: State) => Extra) => 
  (state: State) => ({
    value: string | undefined,
    error: any,
    dirty: boolean,
    touched: boolean,
    active: boolean,
    extra?: Extra
  })

type formSelector = () => <State>(state: State) => ({
    submitting: boolean,
    valid: boolean,
    ready: boolean,
    dirty: boolean,
    pristine: boolean
})

type isValidSelector = () => <State>(state: State) => boolean
type isReadySelector = () => <State>(state: State) => boolean
type isDirtySelector = () => <State>(state: State) => boolean
type isPristineSelector = () => <State>(state: State) => boolean
```

<!--
## Type definitions

- [`formBase`](/types.html#formbase)
- [`setValue`](/types.html#setvalue)
- [`setError`](/types.html#seterror)
- [`setTouched`](/types.html#settouched)
- [`setActive`](/types.html#setactive)
- [`setSubmitting`](/types.html#setsubmitting)
- [`setReady`](/types.html#setready)
- [`resetForm`](/types.html#resetform)
- [`submit`](/types.html#submit)
- [`fieldSelector`](/types.html#fieldselector)
- [`formSelector`](/types.html#formselector)
- [`isValidSelector`](/types.html#isvalidselector)
- [`isReadySelector`](/types.html#isreadyselector)
- [`isDirtySelector`](/types.html#isdirtyselector)
- [`isPristineSelector`](/types.html#ispristineselector)
- [`FormBaseState`](/types.html#formbasestate)
- [`Module`](/types.html#module)
-->
