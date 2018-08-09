import { forEach } from 'light-observable/observable'
import { isEvent } from 'stapp/lib/helpers/is/isEvent/isEvent'
import { isSubscribable } from 'stapp/lib/helpers/is/isSubscribable/isSubscribable'

export const collectEvents = async (
  literallyAnything: any,
  mockState?: any
) => {
  const realDispatch = jest.fn()
  const dispatch = async (event: any) => {
    if (isEvent(event)) {
      realDispatch(event)
    }

    if (isSubscribable(event)) {
      await forEach(dispatch, event)
    }

    if (typeof event === 'function') {
      await event(() => mockState, dispatch)
    }
  }

  await dispatch(literallyAnything)

  return realDispatch.mock.calls.map((call) => call[0])
}
