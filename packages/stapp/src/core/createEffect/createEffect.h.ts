import { Observable } from 'rxjs/Observable'
import { Event, EventCreator1 } from '../createEvent/createEvent.h'

export type EffectCreator<Payload, Result> = {
  (payload: Payload): Observable<Event<any, any>>
  start: EventCreator1<Payload>
  success: EventCreator1<Result>
  fail: EventCreator1<any>
  use(effectFn: (payload: Payload) => Promise<Result> | Result): EffectCreator<Payload, Result>
  getType(): string
}
