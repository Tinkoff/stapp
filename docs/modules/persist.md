# Persist

`stapp-persist` is a module capable of persisting and rehydrating an application's state. `stapp-persist` is as compatible with [redux-persist](https://github.com/rt2zz/redux-persist) library as possible. You can use storages, transformers, and reconcilers compatible with `redux-persist`.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
  - [`whiteList` and `blackList`](#whitelist-and-blacklist)
  - [`throttle`](#throttle)
  - [`serialize`](#serialize)
  - [`timeout`](#timeout)
  - [Other](#other)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
```bash
npm install stapp-persist stapp rxjs
# OR using stapp-cli-tools
stapp install stapp-persist
```

### Peer dependencies
* **stapp**: >= 2.6
* **rxjs**: >= 6

## Definition

```typescript
type persist = (config: {
  key: string
  storage: AsyncStorage
  whiteList?: string[]
  blackList?: string[]
  transforms?: Transform[]
  throttle?: number
  stateReconciler?: (<S>(restoredState: S, originalState: S) => S) | false
  serialize?: boolean
  timeout?: number
}) => Module<{ clearStorage: () => void }, {}>

type AsyncStorage = {
  getItem(key: string): Promise<any>
  removeItem(key: string): Promise<any>
  setItem(key: string, value: string): Promise<any>
}

type Transform = {
  in: (subState: any, key?: string, state?: any) => any,
  out: (subState: any, key?: string, state?: any) => any,
  config?: PersistConfig,
}
```

## Usage

Primary case: use sessionStorage or localStorage to store and rehydrate an application's state.

```js
import { createApp } from 'stapp'
import { persist, toAsync } from 'stapp-persist'

const app = createApp({
  name: 'My App',
  modules: [
    persist({
      key: 'My App',
      storage: toAsync(sessionStorage)
    }),
    ...otherModules
  ]
})

// later, if saving storage
```

### `whiteList` and `blackList`

`whiteList` and `blackList` will filter state by keys. Note, that  `whiteList` has higher priority than `blackList`: if both are provided, only `whiteList` will be used.

### `throttle`

Throttles state changes before saving them to the storage.

### `serialize`

If set to `false`, will not serialize and deserialize values.

### `timeout`

Ignores value, returned from `storage.getItem()` if the execution time exceeds timeout value.

### Other

As stated, `stapp-persist` API is made as compatible with redux-persist as possible. See [redux-perist docs](https://github.com/rt2zz/redux-persist) for more information on transformers, storages, and state reconcilers.

<!--
## Type definitions

* [`persist`](/types.html#persist)
* [`toAsync`](/types.html#toasync)
* [`PersistConfig`](/types.html#persistconfig)
* [`AsyncStorage`](/types.html#asyncstorage)
* [`Transform`](/types.html#transform)
-->
