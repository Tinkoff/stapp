# Loaders

`stapp-loaders` module offers an opinionated approach to "isLoading" problem. It exposes a "loaders" state, a couple of event creators, and an `isLoadingSelector` creator.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type loaders = () => Module<{}, { loaders: { [K: string]: boolean } }>
```

## Usage

`loaderStart` and `loaderEnd` event creators are not exposed to an application API. They should be imported and used by your modules.

```js
// myModule.js
import { mapTo } from 'light-observable/operators'
import { createEffect, combineEpics } from 'stapp'
import { loaderStart, loaderEnd, LOADERS } from 'stapp-loaders'

const loadData = createEffect('Load data', () => /* some async process */)

export const myModule = {
  name: 'my module',
  api: {
    loadData
  },
  epic: combineEpics([
    loadData.start.epic(start$ => start$.pipe(mapTo(loaderStart('loadData')))),
   	loadData.success.epic(start$ => start$.pipe(mapTo(loaderEnd('loadData')))),
    loadData.fail.epic(start$ => start$.pipe(mapTo(loaderEnd('loadData'))))
  ]),
  dependencies: [LOADERS] // this is not neccesary but is recommended, so that you won't forget to use loaders module in your app.
}

// app.js
import { loaders, isLoadingSelector } from 'stapp-loaders'
import { myModule } from './myModule.js'

const app = createApp({
  name: 'my app',
  modules: [
    loaders(),
    myModule
  ]
})

const isLoading = isLoadingSelector() // selectors should be created individually for every app

app.subscribe(console.loog)
// { loaders: {} }

app.api.loadData()
// { loaders: { loadData: true } }
isLoading(app.getState()) // true

// A bit later, after an async process have finished
// { loaders: { loadData: false }}
isLoading(app.getState()) // false
```
<!--
## Type definitions

* [`loaders`](/types.html#loaders)
* [`loaderStart`](/types.html#loaderstart)
* [`loaderEnd`](/types.html#loaderend)
* [`isLoadingSelector`](/types.html#isloadingselector)
* [`Module`](/types.html#module)
-->
