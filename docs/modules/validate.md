# Validate

Validation itself is up to you, `stapp-validate` module provides a way to connect your favorite validation library to the application and store validation results in the applications state. `stapp-validate` module is intended to be used with `stapp-formbase` module.

Debouncing, throttling and other time-controlling mechanisms are up to you.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
  - [`isValidatingSelector()`](#isvalidatingselector)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type validate = (config: {
  rules: { [K: string]: ValidationRule },
  validateOnInit: boolean // defaults to `true`
  setTouchedOnSubmit?: boolean // defaults to `true`
}) => Module<{}, { validating: { [K: string]: boolean } }>

type ValidationRule<State extends FormBaseState> = (
  value: string | void,
  fieldName: string,
  state: State,
  flags: {
    onChange?: boolean,
    onInit?: boolean,
    onRevalidate?: boolean
  }
) => any
```

## Usage

Import `stapp-validate` module and provide some rules. Don't forget `stapp-formbase` module.

```js
import { createApp } from 'stapp'
import { formBase } from 'stapp-formbase'
import { validate } from 'stapp-validate'

const app = createApp({
  modules: [formBase(), validate({
    rules: [...rules]
  })]
})
```

Validation rules are called each on its field change, right after initialization (can be disabled) and on `revalidate` event (exported, but not mixed into application api). Each rule receives these arguments:

* `value`: new value of the field
* `fieldName`: name of the changed field
* `state`: the whole applications state
* `flags`: flags indicate the reason why the rule was called

Validation rule can return anything. Here are some rules:

* `false`, `undefined` and `null` means that everything is ok

  ```js
  const app = createApp({
    modules: [
      validate({
        rules: {
          age: value => value < 18 ? 'Too young!' : null
        }
      })
    ]
  })

  app.subscribe(state => console.log(state.errors))
  app.dispatch(setValue({ age: 10 }))  // { age: 'Too young!' }
  app.dispatch(setValue({ age: 50 }))  // {}
  ```


* objects will be passed to `setError` as is

  ```js
  const app = createApp({
    modules: [
      validate({
        rules: {
          name (name, fieldName, state) {
            if (name !== state.values.username) {
              return
            }

            return {
              name: 'Username and name cannot be equal!',
              username: 'Username and name cannot be equal!'
            }
        	}
        }
      })
    ]
  })

  app.subscribe(state => console.log(state.errors))
  app.dispatch(setValue({
    name: 'john',
    username: 'john'
  }))
  // {
  //   name: 'Username and name cannot be equal!'
  //   username: 'Username and name cannot be equal!'
  // }
  ```

* promises will be awaited, and these rules will be applied to their result recursively

  ```js
  const app = createApp({
    modules: [
      validate({
        rules: {
          async age (value, fieldName, state) {
            await wait(500)

            return value < 18 ? 'Too young!' : null
        	}
        }
      })
    ]
  })

  app.subscribe(console.log)
  app.dispatch(setValue({ age: 10 }))

  // {
  //   values: { age: 10 },
  //   ready: { age: false },
  //   validating: { age: true }
  //   errors: {}
  // }

  // some time later

  // {
  //   values: { age: 10 },
  //   ready: { age: true },
  //   validating: { age: false },
  //   errors: { age: 'Too young!' }
  // }
  ```

* any other value returned from a validation function will be regarded as an error value (Error instances, arrays, strings, numbers, etc.)

### `isValidatingSelector()`

`stapp-validate` module comes with `isValidatingSelector` selector creator. Use it to create memoized selector, that will return `true` or `false` depending on validation state.

### `revalidate`
`revalidate` event can be used to cause validation. Accepts an optional array of field names to revalidate.
```typescript
import { revalidate } from 'stapp-validate'

// Dispatch an array of field names to revalidate selectively...
app.dispatch(revalidate(['fieldA', 'fieldB']))

// or without arguments to revalidate all fields
app.dispatch(revalidate())
```

<!--
## Type definitions

- [`validate`](/types.html#validate)
- [`revalidate`](/types.html#revalidate)
- [`isValidatingSelector`](/types.html#isvalidatingselector)
- [`ValidationFlags`](/types.html#validationflags)
- [`ValidationState`](/types.html#validationstate)
- [`ValidateConfig`](/types.html#validateconfig)
- [`ValidationRule`](/types.html#validationrule)
- [`Module`](/types.html#module)
-->
