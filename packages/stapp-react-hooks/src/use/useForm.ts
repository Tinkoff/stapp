import { formSelector } from 'stapp-formbase'
import { useStapp } from './useStapp'

export const useForm = () => {
  const [formData, api, app] = useStapp(formSelector())

  const handleSubmit = (syntheticEvent) => {
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
