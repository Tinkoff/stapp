

# `createEvent()`

Creates an event creator.

Event creator is a function that accepts any number of arguments, transforms them into payload and returns an FSA-compliant object.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definitions](#definitions)
- [Usage](#usage)
  - [`getType()`](#gettype)
  - [`is()`](#is)
  - [`epic()`](#epic)
  - [Typescript examples](#typescript-examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definitions

```typescript
type createEvent<Payload, Meta> = (
  description?: string,
  payloadCreator?: (...args: any[]) => Payload,
  metaCreator?: (...args: any[]) => Meta
) => EventCreator

type EventCreator = {
  (...args: any[]): Event  
  getType(): string
  is(event: Event): boolean
  epic(fn: Epic): Epic
}
```

A description is not required but strongly recommended if you are using inspecting tools like redux-devtools or redux-logger.

## Usage

`createEvent` is quite a powerful tool. In a most primitive case, you'll pass only a description.

```js
import { createEvent } from 'stapp'

const increment = createEvent('Increment')

const event = increment(1)
// {
//   type: 'Increment [0]' // Number in the brackets is unique for each event creator,
//   payload: 1,
//   error: false
// }
```

`createEvent` accepts a second argument - `payloadCreator`. It will be called with all arguments, provided to an event creator.

```js
import { createEvent } from 'stapp'

const doubleIncrement = createEvent('Increment', n = n * 2)

const event = increment(1)
// {
//   type: 'Increment [0]'
//   payload: 2,
//   error: false
// }
```

The third argument may be used for creating a custom meta for an event.

```js
import { createEvent } from 'stapp'

const incrementWithMeta = createEvent('Increment', undefined, x => ({ myMeta: x * 10 }))

const event = increment(1)
// {
//   type: 'Increment [0]'
//   payload: 1,
//   meta: {
//     myMeta: 10
//   },
//   error: false
// }
```

### `getType()`

Returns the type of an event. You may need this value in case you want to create reducers on your own. Every EventCreator has its own unique type.

```js
const increment = createEvent('Descriptions can be same')
const decrement = createEvent('Descriptions can be same')

increment.getType() === decrement.getType() // false
increment().type === increment.getType() // true
```

### `is()`

Checks if provided event is of EventCreator's type.

```javascript
const increment = createEvent()

increment.is(increment()) // true

// Usage in epics
const epic = (event$) => event$.pipe(
  filter(increment.is)
  // other stuff
)
```

### `epic()`

Accepts an Epic and returns an Epic. Provides a filtered stream of events to incoming Epic.

```js
const increment = createEvent()

const epic = increment.epic(increment$ => /* other stuff */)
```

### Typescript examples

```typescript
import { createEvent } from 'stapp'

// An event creator that doesn't accept any arguments.
const sumbit = createEvent('Submit')

// An event creator that accepts a single argument and uses provided value as a payload.
const add = createEvent<number>('Add')
add(2).payload // => 2

// An event creator that doesn't accept arguments but still have a payload
const addOne = createEvent('Add one', () => 1)
addOne().payload // => 1

// An event creator that accepts and transforms a single argument
const doubleAdd = createEvent('Double add', (x: string) => Number(x) * 2)
doubleAdd('10').payload // => 20

// An event creator that accepts and transforms two arguments
const sum = createEvent('Combine values', (x: number, y: string) => x + Number(y))
sum(10, '20').payload // => 30

// Well, you can use any number of arguments.
const enfantTerrible = createEvent('Because I can', (x: number, y: string, z: { n: number }) => (x + Number(y) - z.n).toString())
enfantTerrible(10, '20', { n: 100 }).payload  // => '-70'
```
<!--
## Type definitions

* [`createEvent`](/types.html#createevent)
* [`PayloadTransformer*`](/types.html#payloadtransformer0)
* [`EventCreator*`](/types.html#eventcreator0)
* [`Event`](/types.html#event)
-->
