// tslint:disable-next-line no-unused-variable // Needed for declarations
import PropTypes from 'prop-types'
// tslint:disable-next-line no-unused-variable // Needed for declarations
import React, { ReactElement, StatelessComponent } from 'react'
// tslint:disable-next-line no-unused-variable // Needed for declarations
import RxJS from 'rxjs'
import { createConsume, createConsumer, createField, createForm } from '..'
import { Stapp } from '../../core/createApp/createApp.h'
import { FormBaseState } from '../../modules/formBase/formBase.h'
import { ConsumerHoc } from '../createConsume/createConsume.h'
import { ConsumerProps } from '../createConsumer/createConsumer.h'
import { FieldProps } from '../createField/createField.h'
import { FormProps } from '../createForm/createForm.h'

export const createComponents = <State extends FormBaseState, Api>(app: Stapp<State, Api>) => {
  const Consumer = createConsumer(app)
  let consume: ConsumerHoc<State, Api>
  let Form: StatelessComponent<FormProps>
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
