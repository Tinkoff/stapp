import { AnyEventCreator } from 'stapp/lib/core/createEvent/createEvent.h'

export type PickState = Array<string | void>

export type PickConfig<State = any> = {
  on: AnyEventCreator[]
  pick: (state: State) => PickState
  react: AnyEventCreator[]
}
