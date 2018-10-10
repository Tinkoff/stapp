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
  static propTypes = consumerPropTypes as any

  render() {
    return createElement(StappContext.Consumer, {
      children: (app: Stapp<State, Api>) => {
        /* istanbul ignore next */
        if (!app) {
          throw new Error(`${STAPP_REACT} error: Provider missing!`)
        }

        return createElement(
          StappSubscription,
          Object.assign(
            {
              app
            },
            this.props
          )
        )
      }
    })
  }
}
