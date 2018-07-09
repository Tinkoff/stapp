import { SyntheticEvent } from 'react'
import { FormBaseState } from 'stapp-formBase'
import { RenderProps } from '../createConsumer/createConsumer.h'

export type FieldApi<Extra = undefined> = {
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
  extra: Extra
}

export type FieldProps<State extends FormBaseState, Extra> = RenderProps<FieldApi<Extra>> & {
  name: string
  extraSelector?: (state: State) => Extra
}
