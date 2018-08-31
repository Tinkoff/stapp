# React

Stapp comes with a bunch of helpers that allows using stapp application with react easily. There are two types of these helpers: 

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Render-prop pattern](#render-prop-pattern)
- [Binded components](#binded-components)
  - [`createComponents()`](#createcomponents)
  - [`createConsumer()`](#createconsumer)
  - [`createConsume()`](#createconsume)
  - [`createForm()` and `createField()`](#createform-and-createfield)
- [Context-based components](#context-based-components)
  - [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Render-prop pattern
Components created with `stapp-react` helpers (or exported as-is) follow the [render-prop pattern](https://reactjs.org/docs/render-props.html).
```typescript
type RenderProps<S, A = {}, State = S> = {
  children?: (state: S, api: A, app: Stapp<State, A>) => ReactElement<any> | null
  render?: (state: S, api: A, app: Stapp<State, A>) => ReactElement<any> | null
  component?: ReactType<S & {
    api: A
    app: Stapp<State, A>
  }>
}
```

## Binded components
* `createConsumer`: creates a Consumer component
* `createConsume`: old-school higher order component
* `createForm` and `createField`: creates utilities to assist with forms
* `createComponents`: creates all of the above.

### `createComponents()`

```typescript
type createComponents = (app: Stapp) => {
  Consumer: Consumer,
  consume: ConsumerHoc,
  Form: Form,
  Field: Field
}
```

NB: `consume`, `Form` and `Field` components are created "on-demand" with corresponding getters.
This means that you can safely use `createComponents` without worrying about unused components.

Consumer, Form and Field components follow the 
See usage examples below. 

### `createConsumer()`

```typescript
type createConsumer = (app: Stapp) => Consumer

type Consumer<State, Api, Result = State> = React.Component<{
  map?: (state: State, api: Api) => Result
} & RenderProps<Result, Api, State>
```

`Consumer` takes an application state, transforms it with `mapState` (`identity` by default), then takes an application API, transforms it with `mapApi` (`identity` by default) and merges them into one object with `mergeProps` (`Object.assign` by default). On each state update, Consumer calls provided `children` or `render` prop with a resulting object. If `component` prop is used, the provided component will be rendered with a resulting object as props.

Most basic example as possible:

```jsx
import { createConsumer } from 'stapp-react'
import todoApp from '../myApps/todoApp.js'
import ListItem from '../components'

const Consumer = createConsumer(todoApp)

const App = () => <Consumer>
  {
    ({ todos }, { handleClick }) => todos.map((item) => <ListItem
      { ...item }
      key={ item.id }
      onClick={ () => handleClick(item.id) }
    />)
  }
</Consumer>
```

`component` prop usage example:

```jsx
import { createConsumer } from 'stapp-react'
import todoApp from '../myApps/todoApp.js'
import ListItem from '../components'

const Consumer = createContext(todoApp)

const List = ({ todos, handleClick }) => {
  return todos.map((item) => <ListItem
    { ...item }
    key={ item.id }
    onClick={ () => handleClick(item.id) }
  />
}
const App = () => <Consumer component={ List } />
```

### `createConsume()`

```typescript
type createConsume = (Consumer: Consumer) => ConsumerHoc
type createInject = (Consumer: Consumer) => ConsumerHoc // theese are aliases

type ConsumerHoc<State, Api, Result> = (
	map?: (state: State, api: Api, props: any) => Result
) => (WrappedComponent: React.ComponentType<Result & { api: Api, app: Stapp<State, Api> }>) => React.ComponentClass
```

`createConsume` creates a classic, familiar HoC, that works almost exactly as `react-redux` `@connect`.

```jsx
import { createConsume } from 'stapp-react'
import todoApp from '../myApps/todoApp.js'

const inject = createConsume(todoApp)

const ListItem = inject(
	(state, api, props) => ({
	  todo: state.todos.find(todo => todo.id === props.id ),
	  handleClick: () => api.handleClick(props.id)
	})
)(({ todo, handleClick }) => {
  return <div onClick={ handleClick }>{ todo.text }</div>
})

const App = inject(
	state => ({ ids: state.todos.map(todo => todo.id) })
)(({ ids }) => {
  return ids.map(id => <ListItem id={ id } key={ id } />)
})
```

### `createForm()` and `createField()`

```typescript
type createForm = (Consumer: Consumer) => Form
type createFiled = (Consumer: Consumer) => Field

type Form = React.Component<RenderProps<FormApi, AppApi, AppState>>

type FormApi = {
  handleSubmit: () => void
  handleReset: () => void
  submitting: boolean // form is in submitting process
  valid: boolean // app has no errors
  dirty: boolean // app has dirty values (that differ from initial values)
  ready: boolean // apps ready state is empty
  pristine: boolean // fields were not touched
}

type Field<State extends FormBaseState, Extra> = React.Component<{
  name: string // field name
  extraSelector: (state: State) => Extra
} & RenderProps<FieldApi<Extra>, AppApi, AppState>>

type FieldApi<Extra = void> = {
  input: {
    name: string
    value: string
    onChange: (event: SyntheticEvent<any>) => void
    onBlur: (event: SyntheticEvent<any>) => void
    onFocus: (event: SyntheticEvent<any>) => void
  }
  meta: {
    error: any // field has an error
    touched: boolean // field was focused
    active: boolean // field is in focus
    dirty: boolean // field value differs from initial value
  }
  extra: Extra
}
```

These methods create form helpers, who handle every common operation with forms. You can find a comprehensive example in the `examples/form-async-validation` folder. Note that form helpers are intended to be used with `stapp-formbase` module (see [stapp-formbase documentation](/modules/formbase.html)).

Basic example:

```jsx
import { createForm, createField } from 'stapp-react'
import formApp from '../myApps/formApp.js'

const Form = createForm(formApp)
const Field = createField(formApp)

const App = () => {
  return <Form>
    {
      ({ handleSubmit, submitting, valid, pristine }) => {
        <Field name="age">
        	({ input, meta }) => <div>
            <label>Age</label>
            <input { ...input } type="number" placeholder="Age" />
            { meta.error && meta.touched && <span>{meta.error}</span> }
          </div>
        </Field>
        
        <button
          disabled={ !valid && !pristine && !submitting }
          onClick={ handleSubmit }
        >
          Submit
        </button>
      }
    }
  </Form>
}
```

## Context-based components
* `consume`: same as `consume` created by `createConsume`, but utilizes the app provided by the `Provider`
* `Provider`: provides an app to the sub-tree
* `Consumer`: same as `Consumer` created by `createConsumer`, but utilizes the app provided by the `Provider`
* `Form`: same as `Form` created by `createForm`, but utilizes the app provided by the `Provider`
* `Field`: same as `Field` created by `createField`, but utilizes the app provided by the `Provider`

Context based versions of react helpers is useful when you need reusable components that utilize different apps.

### Example
[![Edit 8yvv75r050](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/8yvv75r050)

```js
// app.js
import { createApp, createEvent, createReducer } from 'stapp'

const counterModule = () => {
  const inc = createEvent()
  const dec = createEvent()
  return {
    name: 'test',
    state: {
      counter: createReducer(0)
        .on(inc, (s) => s + 1)
        .on(dec, (s) => s - 1)
    },
    api: {
      inc,
      dec
    }
  }
}

const getApp = () => createApp({
  modules: [counterModule()]
})

export const app1 = getApp()
export const app2 = getApp()

// Buttons.js
import React from 'react'
import { Consumer } from 'stapp-react'
export const Buttons = () => <Consumer>
  {(state, api) => <>
    <p>Current: { state.counter }</p>
    <p>
      <button onClick={api.inc}>Increase</button>{' '}
      <button onClick={api.dec}>Decrease</button>
    </p>
  </>}
</Consumer>

// App.js
import React from 'react'
import { Provider } from 'stapp-react'
import { app1, app2 } from './app'
import { Buttons } from './Buttons'
const App = () => {
  return <>
    <Provider app={app1}>
      <Buttons />
    </Provider>
    <Provider app={app2}>
      <Buttons />
    </Provider>
  </>
}
```
<!--
## Type definitions

* [`createConsumer`](/types.html#createconsumer)
* [`createConsume`](/types.html#createconsume)
* [`createForm`](/types.html#createform)
* [`createField`](/types.html#createfield)
* [`createComponents`](/types.html#createcomponents)
-->
