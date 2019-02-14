import { SyntheticEvent } from 'react'

export type FormApi = {
  handleSubmit: (event?: SyntheticEvent<any>) => void
  handleReset: (event?: SyntheticEvent<any>) => void
  submitting: boolean
  valid: boolean
  ready: boolean
  dirty: boolean
  pristine: boolean
}

export type FieldApi = {
  input: {
    name: string
    value: string
    onChange: (event: SyntheticEvent<any>) => void
    onBlur: (event?: SyntheticEvent<any>) => void
    onFocus: (event?: SyntheticEvent<any>) => void
  }
  meta: {
    error: any
    touched: boolean
    active: boolean
    dirty: boolean
  }
  extra: any
}
