import {
  createContext,
  createElement,
  ReactNode,
  StatelessComponent
} from 'react'

import { Stapp } from 'stapp'

export type Context = { app: Stapp<any, any> }

export const StappContext = createContext<Context>({} as any)

export const Provider = <State, Api>({
  app,
  children
}: {
  app: Stapp<State, Api>
  children?: ReactNode
}) =>
  createElement(StappContext.Provider, {
    value: { app },
    children
  })
;(Provider as StatelessComponent<any>).displayName = 'Stapp.Provider'
