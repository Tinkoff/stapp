import { Component, createElement } from 'react'
import { Stapp } from 'stapp'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { STAPP_REACT } from '../helpers/constants'
import { consumerPropTypes } from '../helpers/propTypes'
import { AppSubscription } from './AppSubscription'
import { StappContext } from './Provider'

// Models
import { ConsumerProps } from '../models/Props'

export class Consumer<State, Api> extends Component<
  ConsumerProps<State, Api, any>
> {
  static displayName = 'Stapp.Consumer'
  static propTypes = consumerPropTypes
  static defaultProps = {
    map: identity
  }

  render() {
    return createElement(StappContext.Consumer, {
      children: (app: Stapp<State, Api>) => {
        if (!app) {
          throw new Error(`${STAPP_REACT} error: Provider missing!`)
        }

        return createElement(AppSubscription, {
          ...this.props,
          app
        })
      }
    })
  }
}
