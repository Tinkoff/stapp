import { ComponentClass, ReactElement, ReactType } from 'react'
import { Stapp } from 'stapp'

export type RenderProps<T> = {
  children?: (api: T) => ReactElement<any> | null
  render?: (api: T) => ReactElement<any> | null
  component?: ReactType
}

/**
 * Type inferring will be available... someday
 * Typings are still in... progress
 * @typeparam State application store state
 * @typeparam Api application api interface
 */
export type ConsumerProps<State, Api, SelectedState, SelectedApi, Result> = {
  mapState?: (state: State) => SelectedState
  mapApi?: (api: Api) => SelectedApi
  mergeProps?: (selectedState: SelectedApi, selectedApi: SelectedApi) => Result
} & RenderProps<Result>

/**
 * @typeparam State application store state
 * @typeparam Api application api interface
 * @private
 */
export type ConsumerClass<State, Api, SelectedState, SelectedApi, Result> = ComponentClass<
  ConsumerProps<State, Api, SelectedState, SelectedApi, Result>
> & {
  app: Stapp<State, Api>
}
