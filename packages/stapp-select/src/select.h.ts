import {
  AnyEventCreator,
  EventCreator1
} from 'stapp/lib/core/createEvent/createEvent.h'

export type SelectState = any

export type SelectConfig<State, Result, Name extends string> = {
  name: Name
  selector: (state: State) => Result
  reactOn: Array<AnyEventCreator | string>
  reactWith?: Array<EventCreator1<Result>>
}
