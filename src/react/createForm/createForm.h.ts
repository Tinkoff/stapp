import { SyntheticEvent } from 'react'
import { RenderProps } from '../createConsumer/createConsumer.h'

export type FormApi = {
  handleSubmit: (event: SyntheticEvent<any>) => void
  valid: boolean
  ready: boolean
  dirty: boolean
  pristine: boolean
}

export type FormProps = RenderProps<FormApi>
