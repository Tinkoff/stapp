# `createApp()`

Creates a [Stapp](/api/Stapp.html) application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
  - [Config](#config)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type createApp = (config: {
  name?: string
  modules: Array<Module | ModuleFactory>
  dependencies?: any
  rehydrate?: any
  middlewares?: Middleware[]
}) => Stapp
```

## Usage
See [Stapp](/api/Stapp.html) section for examples.

### Config

* **`name`**: Name is not required but recommended if you have more than one app (and you should have more than one app, in other cases, you might not need this library) and use redux-devtools. 
* **`modules`**: See more about modules in the [corresponding section](/usage/modules.html).
* **`dependencies`**: Any function provided as a module will be called with the value of this field.
* **`middlewares`**: An array of any custom redux middlewares.
* **`rehydrate`**: Value, provided here, will be used as an initial state in `redux.createStore` method.

<!--
## Type definitions

* [`createApp`](/types.html#createApp)
* [`Stapp`](/types.html#stapp)
* [`Module`](/types.html#module)
* [`ModuleFactory`](/types.html#modulefactory)
-->
