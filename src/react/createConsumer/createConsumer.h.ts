import { ReactElement, ReactType } from 'react'

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
