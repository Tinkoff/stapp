import shallowEqual from 'fbjs/lib/shallowEqual'
import { useState, useEffect, useContext } from 'react'
import { Stapp } from 'stapp'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { StappContext } from 'stapp-react/lib/shared/StappContext'
import { StappApi } from 'stapp/lib/core/createApp/createApp.h'
import { StappState } from 'stapp/lib/core/createApp/createApp.h'
import { STAPP_REACT_HOOKS } from '../helpers/constants'

type Selector<T extends Stapp<any, any>, Result> = (
  state: StappState<T>,
  api: StappApi<T>,
  app: T
) => Result

export const useStapp = <T extends Stapp<any, any>, Result = StappState<T>>(
  selector: Selector<T, Result> = identity as any
): [Result, StappApi<T>, T] => {
  const app = useContext<T | null>(StappContext as any)

  /* istanbul ignore next */
  if (!app) {
    throw new Error(`${STAPP_REACT_HOOKS} error: Provider missing!`)
  }

  const [state, setState] = useState(selector(app.getState(), app.api, app))

  useEffect(
    () => {
      const subscription = app.subscribe((_nextState) => {
        const nextState = selector(_nextState, app.api, app)

        if (!shallowEqual(state, nextState)) {
          setState(nextState)
        }
      })

      return () => subscription.unsubscribe()
    },
    [app]
  )

  return [state, app.api, app]
}
