import { Observable } from 'rxjs'
import { ObservableConfig } from 'stapp'
import { identity } from 'stapp/lib/helpers/identity/identity'

export const observableConfig: ObservableConfig<Observable<any>> = {
  fromESObservable: identity,
  toESObservable: identity
}
