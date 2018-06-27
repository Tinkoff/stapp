import { StatelessComponent } from 'react'
import { createConsume, createConsumer, createField, createForm } from '..'
import { Stapp } from '../../core/createApp/createApp.h'
import { FormBaseState } from '../../modules/formBase/formBase.h'
import { ConsumerHoc } from '../createConsume/createConsume.h'
import { ConsumerClass } from '../createConsumer/createConsumer.h'
import { FieldProps } from '../createField/createField.h'
import { FormProps } from '../createForm/createForm.h'
import { StappComponents } from './createComponents.h'

export const createComponents = <State extends FormBaseState, Api>(
  app: Stapp<State, Api>
): StappComponents<State, Api> => {
  let Consumer: ConsumerClass<State, Api, any, any, any>
  let consume: ConsumerHoc<State, Api>
  let Form: StatelessComponent<FormProps>
  let Field: StatelessComponent<FieldProps<State, Api>>

  return {
    get Consumer() {
      return Consumer || (Consumer = createConsumer(app))
    },

    get consume() {
      return consume || (consume = createConsume(this.Consumer))
    },

    get Form() {
      return Form || (Form = createForm(this.Consumer))
    },

    get Field() {
      return Field || (Field = createField(this.Consumer))
    }
  }
}
