import { ComponentClass, ComponentType } from 'react'
import { Omit } from '../../models/helpers.h'

/**
 * @hidden
 */
export type ConsumerHoc<State, Api> = {
  // No mapState and no mapApi
  (): <
    ConsumerProps extends Partial<State & Api>,
    ResultProps extends Omit<ConsumerProps, keyof (State & Api)>
  >(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>

  // MapState using only state
  <SelectedState>(mapState: (state: State, props?: any) => SelectedState): <
    ConsumerProps extends Partial<SelectedState & Api>,
    ResultProps = Omit<ConsumerProps, keyof (SelectedState & Api)>
  >(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>

  // MapState using props and state
  // Something really bad is happening here
  // <SelectedState, ResultProps>(
  //   mapState: (state: State, props: ResultProps) => SelectedState
  // ): (
  //   component: ComponentType<Partial<SelectedState & Api & ResultProps>>
  // ) => ComponentClass<ResultProps>

  // MapApi
  <SelectedApi>(mapState: undefined, mapApi: (api: Api, props?: any) => SelectedApi): <
    ConsumerProps extends Partial<State & SelectedApi>,
    ResultProps = Omit<ConsumerProps, keyof (State & SelectedApi)>
  >(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>

  // MapState and mapApi
  <SelectedState, SelectedApi>(
    mapState: (state: State, props?: any) => SelectedState,
    mapApi: (api: Api, props?: any) => SelectedApi
  ): <
    ConsumerProps extends Partial<SelectedState & SelectedApi>,
    ResultProps = Omit<ConsumerProps, keyof (SelectedState & SelectedApi)>
  >(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>

  // MergeProps
  <Result>(
    mapState: undefined,
    mapApi: undefined,
    mergeProps: (state: State, api: Api, props?: any) => Result
  ): <ConsumerProps extends Partial<Result>, ResultProps = Omit<ConsumerProps, keyof Result>>(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>

  // MapState & mergeProps
  <SelectedState, Result>(
    mapState: (state: State, props?: any) => SelectedState,
    mapApi: undefined,
    mergeProps: (state: SelectedState, api: Api, props?: any) => Result
  ): <ConsumerProps extends Partial<Result>, ResultProps = Omit<ConsumerProps, keyof Result>>(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>

  // MapApi & mergeProps
  <SelectedApi, Result>(
    mapState: undefined,
    mapApi: (api: Api, props?: any) => SelectedApi,
    mergeProps: (state: State, api: SelectedApi, props?: any) => Result
  ): <ConsumerProps extends Partial<Result>, ResultProps = Omit<ConsumerProps, keyof Result>>(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>

  // MapState, mapApi & mergeProps
  <SelectedState, SelectedApi, Result>(
    mapState: (state: State, props?: any) => SelectedState,
    mapApi: (api: Api, props?: any) => SelectedApi,
    mergeProps: (state: SelectedState, api: SelectedApi, props?: any) => Result
  ): <ConsumerProps extends Partial<Result>, ResultProps = Omit<ConsumerProps, keyof Result>>(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>
}
