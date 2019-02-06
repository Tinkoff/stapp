import { fieldSelector } from 'stapp-formbase'
import { useStapp } from './useStapp'

export const useField = (name, extraSelector) => {
  const [fieldState, api, app] = useStapp(fieldSelector(name, extraSelector))

  const onChange = (event) => {
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
        name: name,
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
