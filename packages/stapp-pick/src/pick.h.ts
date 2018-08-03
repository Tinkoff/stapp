import { EventCreator1 } from 'stapp/lib/core/createEvent/createEvent.h'

export type PickState = Array<string | void>

export type PickConfig<State = any> = {
  on: Array<EventCreator1<any>>
  pick: (state: State) => PickState
  react: Array<EventCreator1<any>>
}
