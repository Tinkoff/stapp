import { Observable } from 'rxjs'
import { identity } from '../../helpers/identity/identity'
import { Module, ObservableConfig } from './createApp.h'

let globalObservableConfig: ObservableConfig<any> = {}

export const setObservableConfig = <T>(config: ObservableConfig<T>) => {
  globalObservableConfig = config
}

export const getConfig = ({
  useGlobalObservableConfig = true,
  observableConfig
}: Module<any, any>): {
  fromESObservable: (innerStream: Observable<any>) => any
  toESObservable: (outerStream: any) => Observable<any>
} => {
  const config = observableConfig
    ? observableConfig
    : useGlobalObservableConfig
    ? globalObservableConfig
    : {}

  return {
    fromESObservable: config.fromESObservable || identity,
    toESObservable: config.toESObservable || identity
  }
}
