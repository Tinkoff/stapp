import {
  createContext,
  createElement,
  ReactNode,
  StatelessComponent
} from 'react'

import { Stapp } from 'stapp'
import { Subscription } from '../subscription/subscription'

export type Context = { state?: any; app?: Stapp<any, any> }

export const StappContext = createContext<Context>({})

export const Provider = <State, Api>({
  app,
  children
}: {
  app: Stapp<State, Api>
  children?: ReactNode
}) => {
  return createElement(Subscription, {
    source: app,
    children: (state: State) => {
      return createElement(StappContext.Provider, {
        value: { state, app },
        children
      })
    }
  })
}

;(Provider as StatelessComponent<any>).displayName = 'Stapp.Provider'
