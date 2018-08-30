import { filter } from 'light-observable/observable'
import { Epic } from '../../core/createApp/createApp.h'
import { AnyEventCreator } from '../../core/createEvent/createEvent.h'
import { isArray } from '../../helpers/is/isArray/isArray'
import { select, selectArray } from '../../helpers/select/select'

export const createEpic = <Payload, Meta, State>(
  events:
    | AnyEventCreator<Payload, Meta>
    | string
    | Array<AnyEventCreator | string>,
  fn: Epic<State>
): Epic<State> => {
  const selector = isArray(events) ? selectArray(events) : select(events)

  return (events$, state$, staticApi) => {
    const filtered = staticApi.fromESObservable(
      filter(selector, staticApi.toESObservable(events$))
    )

    return fn(filtered, state$, staticApi)
  }
}
