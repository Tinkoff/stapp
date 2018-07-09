import { createConsume } from '../createConsume/createConsume'
import { createConsumer } from '../createConsumer/createConsumer'
import { createField } from '../createField/createField'
import { createForm } from '../createForm/createForm'

// Models
// tslint:disable-next-line no-unused-variable // declarations
import { Subscription } from 'light-observable' // don't ask why, we'll try to fix it later
// tslint:disable-next-line no-unused-variable // declarations
import React, { ReactElement, StatelessComponent } from 'react'
import { Stapp } from 'stapp'
import { FormBaseState } from 'stapp-formBase'
import { ConsumerHoc } from '../createConsume/createConsume.h'
import { ConsumerProps, RenderProps } from '../createConsumer/createConsumer.h'
import { FieldProps } from '../createField/createField.h'
import { FormApi } from '../createForm/createForm.h'

export const createComponents = <State extends FormBaseState, Api>(app: Stapp<State, Api>) => {
  const Consumer = createConsumer(app)
  let consume: ConsumerHoc<State, Api>
  let Form: StatelessComponent<RenderProps<FormApi>>
  let Field: <Extra>(
    config: FieldProps<State, Extra>
  ) => ReactElement<ConsumerProps<State, Api, any, any, any>>

  return {
    Consumer,

    get consume() {
      return consume || (consume = createConsume(Consumer))
    },

    get Form() {
      return Form || (Form = createForm(Consumer))
    },

    get Field() {
      return Field || (Field = createField(Consumer))
    }
  }
}
