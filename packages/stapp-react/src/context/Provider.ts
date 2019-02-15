import { createElement, FunctionComponent, ReactNode } from 'react'
import { Stapp } from 'stapp'
import { StappContext } from '../shared/StappContext'

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
