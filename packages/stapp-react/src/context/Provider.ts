import {
  createContext,
  createElement,
  ReactNode,
  StatelessComponent
} from 'react'

import { Stapp } from 'stapp'

export const StappContext = createContext<Stapp<any, any> | null>(null)

export const Provider = <State, Api>({
  app,
  children
}: {
  app: Stapp<State, Api>
  children?: ReactNode
}) =>
  createElement(StappContext.Provider, {
    value: app,
    children
  })
;(Provider as StatelessComponent<any>).displayName = 'Stapp.Provider'
