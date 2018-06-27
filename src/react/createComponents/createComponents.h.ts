import { StatelessComponent } from 'react'
import { ConsumerHoc } from '../createConsume/createConsume.h'
import { ConsumerClass } from '../createConsumer/createConsumer.h'
import { FieldProps } from '../createField/createField.h'
import { FormProps } from '../createForm/createForm.h'

export type StappComponents<State, Api> = {
  Consumer: ConsumerClass<State, Api, any, any, any>
  consume: ConsumerHoc<State, Api>
  Form: StatelessComponent<FormProps>
  Field: StatelessComponent<FieldProps>
}
