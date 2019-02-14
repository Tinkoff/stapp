import { SyntheticEvent } from 'react'
import { Stapp, StappApi, StappState } from 'stapp'
import { fieldSelector } from 'stapp-formbase'
import { FieldApi } from 'stapp-react'
import { useStapp } from './useStapp'

export const useField = <App extends Stapp<any, any>, Extra = any>(
  name: string,
  extraSelector?: (state: StappState<App>) => Extra
): [FieldApi, StappApi<App>, App] => {
  const [fieldState, api, app] = useStapp(fieldSelector(name, extraSelector))

  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    api.formBase.setValue({
      [name]: event.currentTarget.value
    })
  }

  const onBlur = () => {
    api.formBase.setActive(null)
    api.formBase.setTouched({ [name]: true })
  }

  const onFocus = () => {
    api.formBase.setActive(name)
  }

  return [
    {
      input: {
        name,
        value: fieldState.value || '',
        onChange,
        onBlur,
        onFocus
      },
      meta: {
        error: fieldState.error,
        touched: fieldState.touched,
        active: fieldState.active,
        dirty: fieldState.dirty
      },
      extra: fieldState.extra
    },
    api,
    app
  ]
}
