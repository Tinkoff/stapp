import { Observable } from 'light-observable'
import { EmptyEventCreator, Event, EventCreator1 } from '../createEvent/createEvent.h'

export type EffectCreator<Payload, Result> = {
  (payload: Payload): Observable<Event<any, any>>
  start: EventCreator1<Payload>
  success: EventCreator1<Result>
  fail: EventCreator1<any>
  complete: EmptyEventCreator
  use(effectFn: (payload: Payload) => Promise<Result> | Result): EffectCreator<Payload, Result>
  getType(): string
}
