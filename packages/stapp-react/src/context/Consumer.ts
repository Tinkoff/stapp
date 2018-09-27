import { Component, createElement } from 'react'
import { Stapp } from 'stapp'
import { STAPP_REACT } from '../helpers/constants'
import { consumerPropTypes } from '../helpers/propTypes'
import { StappSubscription } from '../helpers/StappSubscription'
import { StappContext } from './Provider'

// Models
import { ConsumerProps } from '../models/Props'

export class Consumer<State, Api> extends Component<
  ConsumerProps<State, Api, any>
> {
  static displayName = 'Stapp.Consumer'
  static propTypes = consumerPropTypes

  render() {
    return createElement(StappContext.Consumer, {
      children: (app: Stapp<State, Api>) => {
        if (!app) {
          throw new Error(`${STAPP_REACT} error: Provider missing!`)
        }

        return createElement(StappSubscription, {
          ...this.props,
          app
        })
      }
    })
  }
}
