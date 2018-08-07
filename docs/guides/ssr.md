# Server-side render

There is not that much what can be asked from a state-management library to support server-side render, but we tried to do our best.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
  - [Timeouts](#timeouts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The main thing about server-side is delaying render until everything needed is loaded. Modules can tell the application what events they need to receive before the app can be rendered. The application exposes a special field, `ready`, which is a Promise, that will resolve after all of these events will be received by the store.

Later this Promise can be used anywhere, e.g., to delay the render on the server-side, or to indicate, that the app is ready to be used on the client-side.

## Waiting for events
```javascript
import { createEvent, createEffect, createReducer, createApp } from 'stapp'
const myEffect = createEffect('My effect', () => Promise.resolve('my data'))
const triggerEffect = createEvent('start effect') 
const module = {
  state: {
    result: createReducer(null)
      .on(myEffect.success, (_, payload) => payload)
      .on(myEffect.fail, (_, error) => error),
    isLoading: createReducer(false)
      .on(myEffect.start, () => true)
      .on(myEffect.complete, () => false)
  },
  epic: triggerEffect.epic(ev$ => ev$.pipe(
    switchMap(myEffect)
  )),
  api: {
    triggerEffect
  },
  waitFor: [myEffect.complete]
}

const app = createApp({
  name: 'My App',
  modules: [module]
})

// Currently the `ready` promise is not resolved, because
// the app didn't receive `myEffect.complete` event.
app.ready.then(state => {
  console.log('State: ', JSON.stringify(state))
})

app.api.triggerEffect()
// Some time later:
// State: { result: 'my data', isLoading: false }
```

See the working example on codesandbox.io:

[![Edit mzw2ozw8rx](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mzw2ozw8rx?module=%2Fsrc%2Findex.js)

### Timeouts and conditions
Module can provide not only an event creator or an event type, but also an object, defining an event, timeout, and a condition function.
Event will be added to the waiting queue as usual, and it will be removed from it on timeout.
If condition function is provided, an event will be added to the queue only if `condition` returns truthy value.

```typescript
export type WaitFor = Array<
  | AnyEventCreator
  | string
  | {
      event: AnyEventCreator | string
      timeout?: number
      condition?: () => boolean
    }
>
```
