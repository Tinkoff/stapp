import { from } from 'rxjs'
import { filter } from 'rxjs/operators'
import { select } from '../../helpers/select/select'
import { Epic } from '../createApp/createApp.h'
import { AnyEventCreator } from '../createEvent/createEvent.h'

export const createEpic = <Payload, Meta, State>(
  events:
    | AnyEventCreator<Payload, Meta>
    | string
    | Array<AnyEventCreator | string>,
  fn: Epic<State>
): Epic<State> => {
  const selector = select(events)

  return (events$, state$, staticApi) => {
    const filtered$ = staticApi.fromESObservable(
      from(staticApi.toESObservable(events$)).pipe(filter(selector))
    )

    return fn(filtered$, state$, staticApi)
  }
}
