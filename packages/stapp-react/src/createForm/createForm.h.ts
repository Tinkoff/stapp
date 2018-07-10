import { SyntheticEvent } from 'react'

export type FormApi = {
  handleSubmit: (event: SyntheticEvent<any>) => void
  valid: boolean
  ready: boolean
  dirty: boolean
  pristine: boolean
}
