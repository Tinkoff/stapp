import { Thunk } from '../createApp/createApp.h'
import { EventCreator1 } from '../createEvent/createEvent.h'

export type EffectCreator<Payload, Result> = {
  (payload: Payload): Thunk<any, Promise<void>>
  start: EventCreator1<Payload>
  success: EventCreator1<Result>
  fail: EventCreator1<any>
  use(effectFn: (payload: Payload) => Promise<Result> | Result): EffectCreator<Payload, Result>
  getType(): string
}
