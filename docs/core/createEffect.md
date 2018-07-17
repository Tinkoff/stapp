

# `createEffect()`

Creates an EffectCreator.

One of the most common patterns when performing side effects inside the epics is dispatching some "start" event before the side effect and "error" or "success" event when the side effect has finished its work. 

Effect creator does that automatically. When called, it returns an observable stream of a start event, then it calls the provided effect function and after that it emits the "success" or "error" event.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type createEffect<Payload, Result> = (
  description: string,
  effect?: (payload: Payload) => Promise<Result> | Result,
  condition?: (payload: Payload) => boolean
) => EffectCreator<Payload, Result>

type EffectCreator<Payload, Result> = {
  (payload: Payload): Result  
  start: EventCreator<Payload>
  success: EventCreator<Result>
  fail: EventCreator<any>
  complete: EventCreator<void>
  getType(): string
  use(effectFn: (payload) => Promise<Result> | Result): EffectCreator<Payload, Result>
}
```

## Usage

Creates an EffectCreator. Accepts a description, a side effect function (optional) and a condition function (defaults to `() => true`).

```js
import { createEffect } from 'stapp'

const payEffect = createEffect(
  // Effect descriptioo=n
  'Perform payment',
  
  // Effect function, optional
  params => fetch(`pay${toQuery(params)}`),
  
  // Condition can be used to disable an effect. Also optional
  () => process.env.ENV === 'browser'
)

// Usage in an epic:
const payEpic = (event$, state$) => state$.pipe(
  sample(select(submit, event$)),
  switchMap(state => payEffect(state.values))
)

```
When called effect creator returns a stream of three events: `start`, then `success` or `fail` after completing side effect and finally, the `complete` event.

The `condition` argument can be used to disable an effect on some conditions.

### `use()`

Replaces an effect function used by EffectCreator in situ. Might be useful while testing.

```javascript
const effect = createEffect('Some side request', sideRequest)

test('some test', async () => {
  const mock = jest.fn(x => x * 2)
  effect.use(mock)
  const events = []
  
  await effect(1).forEach(ev => events.push(ev))
  
  expect(mock).toBeCalledWith(1)

  expect(events).toEqual([
    effect.start(1),
    effect.success(2),
    effect.complete()
  ])
})
```

### `start`

Event emitted by effect creator before performing a side effect.

```js
const effect = createEffect('Some side request', sideRequest)
const startEffectEpic = effect.start.epic(start$ => start$.pipe(...))
```

### `success`

Event emitted by effect creator after resolving the Promise, returned by the side effect function.

```js
const effect = createEffect('Some side request', sideRequest)
const successEffectEpic = effect.success.epic(success$ => success$.pipe(...))
```

### `fail`

Event emitted by effect creator if the side effect function failed in some way.

```js
const effect = createEffect('Some side request', sideRequest)
const failEffectEpic = effect.fail.epic(fail$ => fail$.pipe(...))
```

### `complete`

Event emitted by effect creator after completion of a side effect. Emitted right after `success` or `fail` event.

```js
const effect = createEffect('Some side request', sideRequest)
const finallyEpic = effect.complete.epic(complete$ => complete$.pipe(...))
```

### `getType()`

Returns the type of a start event.

```js
const effect = createEffect('Some side request', sideRequest)

effect.getType() === effect.start.getType() // true
```

<!--
## Type definitions

* [`createEffect`](/types.html/#createeffect)
* [`EffectCreator`](/types.html#effectcreator)

-->
