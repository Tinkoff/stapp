import { ComponentClass, ComponentType } from 'react'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
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
  <SelectedState>(
    map: (state: State, api: Api, props?: any) => SelectedState
  ): <
    ConsumerProps extends Partial<SelectedState & Api>,
    ResultProps = Omit<ConsumerProps, keyof (SelectedState & Api)>
  >(
    component: ComponentType<ConsumerProps>
  ) => ComponentClass<ResultProps>
}
