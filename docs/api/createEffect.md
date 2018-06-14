

# `createEffect()`

Creates an [effect creator](/api/EffectCreator.html).

See EffectCreator section for more documentation.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
- [Type definitions](#type-definitions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type createEffect<Payload, Result> = (
  description: string,
  effect?: (payload: Payload) => Promise<Result> | Result
  condition?: (payload: Payload) => boolean
) => EffectCreator<Payload, Result>
```

## Usage

Creates an EffectCreator. Accepts a description, a side effect function (optional) and a condition function (defaults to `() => true`).

```js
import { createEffect } from 'stapp'

const someEffect = createEffect(
  'Some side request',
  (s) => fetch(`api?s=${s}`),
  () => process.env.ENV === 'browser'
)
```

The `condition` argument can be used to disable an effect on some conditions.

## Type definitions

* [`createEffect`](/types.html/#createeffect)
* [`EffectCreator`](/types.html#effectcreator)

