import { Observable } from 'rxjs'
import {
  EmptyEventCreator,
  Event,
  EventCreator1
} from '../createEvent/createEvent.h'

export type EffectCreator<Payload, Result, Error = any> = {
  (payload: Payload): Observable<Event<any, any>>
  start: EventCreator1<Payload>
  success: EventCreator1<Result>
  fail: EventCreator1<Error>
  complete: EmptyEventCreator
  use(
    effectFn: (payload: Payload) => Promise<Result> | Result
  ): EffectCreator<Payload, Result, Error>
  getType(): string
}
