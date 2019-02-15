import { AnyEventCreator, EventCreator1 } from 'stapp'

export type SelectConfig<State, Result, Name extends string> = {
  name: Name
  selector: (state: State) => Result
  reactOn: Array<AnyEventCreator | string>
  reactWith?: Array<EventCreator1<Result>>
}
