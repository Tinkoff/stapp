export type AsyncStorage = {
  getItem(key: string): Promise<any>
  removeItem(key: string): Promise<any>
  setItem(key: string, data: string): Promise<any>
}

/**
 * Persist module config
 * @typeparam State Application state shape
 */
export type PersistConfig<State = any> = {
  key: string
  storage: AsyncStorage
  whiteList?: string[]
  blackList?: string[]
  transforms?: Transform[]
  throttle?: number
  stateReconciler?: ((restoredState: State, originalState: State) => State) | false
  serialize?: boolean
  timeout?: number
}

export type Transform = {
  in: (subState: any, key?: string, state?: any) => any
  out: (subState: any, key?: string, state?: any) => any
  config?: PersistConfig
}
