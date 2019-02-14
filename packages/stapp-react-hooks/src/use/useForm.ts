import { SyntheticEvent } from 'react'
import { Stapp, StappApi } from 'stapp'
import { formSelector } from 'stapp-formbase'
import { FormApi } from 'stapp-react'
import { useStapp } from './useStapp'

export const useForm = <App extends Stapp<any, any>>(): [
  FormApi,
  StappApi<App>,
  App
] => {
  const [formData, api, app] = useStapp(formSelector())

  const handleSubmit = (syntheticEvent: SyntheticEvent<HTMLFormElement>) => {
    if (
      syntheticEvent &&
      // tslint:disable-next-line strict-type-predicates
      typeof syntheticEvent.preventDefault === 'function'
    ) {
      syntheticEvent.preventDefault()
    }

    api.formBase.submit()
  }

  return [
    {
      handleSubmit,
      handleReset: api.formBase.resetForm,
      submitting: formData.submitting,
      valid: formData.valid,
      ready: formData.ready,
      dirty: formData.dirty,
      pristine: formData.pristine
    },
    api,
    app
  ]
}
