import { SyntheticEvent } from 'react'
import { RenderProps } from '../createConsumer/createConsumer.h'

export type FieldApi = {
  input: {
    name: string
    value: string
    onChange: (event: SyntheticEvent<any>) => void
    onBlur: (event: SyntheticEvent<any>) => void
    onFocus: (event: SyntheticEvent<any>) => void
  }
  meta: {
    error: any
    touched: boolean
    active: boolean
  }
}

export type FieldProps = RenderProps<FieldApi> & {
  name: string
}
