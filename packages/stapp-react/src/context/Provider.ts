import {
  createContext,
  createElement,
  FunctionComponent,
  ReactNode
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
;(Provider as FunctionComponent<any>).displayName = 'Stapp.Provider'
