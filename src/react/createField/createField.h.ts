import { SyntheticEvent } from 'react'
import { RenderProps } from '../createConsumer/createConsumer.h'

export type FieldApi<Custom = undefined> = {
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
  },
  custom: Custom
}

export type FieldProps<Custom> = RenderProps<FieldApi<Custom>> & {
  name: string
  customSelector?: () => Custom
}
