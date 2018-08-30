import { createConsumer } from '../binded/createConsumer'
import { createConsume } from './createConsume'
import { createField } from './createField'
import { createForm } from './createForm'

// Models
import { StatelessComponent } from 'react'
import { Stapp } from 'stapp'
import { FormBaseState } from 'stapp-formbase'
import { ConsumeHoc } from '../models/ConsumeHoc'
import { FormApi } from '../models/Form'
import { FieldProps, RenderProps } from '../models/Props'

export const createComponents = <State extends FormBaseState, Api>(
  app: Stapp<State, Api>
) => {
  const Consumer = createConsumer(app, app.name)
  let consume: ConsumeHoc<State, Api>
  let Form: StatelessComponent<RenderProps<FormApi>>
  let Field: StatelessComponent<FieldProps<State>>

  return {
    Consumer,

    get consume() {
      return consume || (consume = createConsume(Consumer, app.name))
    },

    get Form() {
      return Form || (Form = createForm(Consumer, app.name))
    },

    get Field() {
      return Field || (Field = createField(Consumer, app.name))
    }
  }
}
