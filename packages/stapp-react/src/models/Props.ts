import { ElementType, ReactElement } from 'react'
import { Stapp } from 'stapp'
import { FormBaseState } from 'stapp-formbase'
import { FieldApi } from './Form'

export type RenderProps<S, A = {}, State = S> = {
  children?: (
    state: S,
    api: A,
    app: Stapp<State, A>
  ) => ReactElement<any> | null
  render?: (state: S, api: A, app: Stapp<State, A>) => ReactElement<any> | null
  component?: ElementType<S & { api: A; app: Stapp<State, A> }>
}

export type ConsumerProps<State, Api, Result> = {
  map?: (state: State, api: Api) => Result
} & RenderProps<Result, Api>

export type ApiProps<State, Api> = {
  children?: (api: Api, app: Stapp<State, Api>) => ReactElement<any> | null
  render?: (api: Api, app: Stapp<State, Api>) => ReactElement<any> | null
  component?: ElementType<{ api: Api; app: Stapp<State, Api> }>
}

export type FieldProps<State extends FormBaseState> = RenderProps<FieldApi> & {
  name: string
  extraSelector?: (state: State) => any
}
