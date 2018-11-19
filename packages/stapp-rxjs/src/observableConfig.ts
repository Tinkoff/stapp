import { from as rxFrom, Observable as rxObservable } from 'rxjs'
import { ObservableConfig } from 'stapp'

export const observableConfig: ObservableConfig<rxObservable<any>> = {
  fromESObservable: rxFrom,
  toESObservable: rxFrom
}
