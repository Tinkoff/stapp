import { ComponentClass, ReactElement, ReactType } from 'react'
import { Stapp } from 'stapp'

export type RenderProps<S, A = void> = {
  children?: (state: S, api: A) => ReactElement<any> | null
  render?: (state: S, api: A) => ReactElement<any> | null
  component?: ReactType<S & A>
}

/**
 * Type inferring will be available... someday
 * Typings are still in... progress
 * @typeparam State application store state
 * @typeparam Api application api interface
 */
export type ConsumerProps<State, Api, Result> = {
  map?: (state: State, api: Api) => Result
} & RenderProps<Result, Api>

/**
 * @private
 */
export type ConsumerClass<State, Api, Result> = ComponentClass<
  ConsumerProps<State, Api, Result>
> & {
  app: Stapp<State, Api>
}
