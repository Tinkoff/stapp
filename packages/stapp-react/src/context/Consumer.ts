import { Component, createElement } from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { STAPP_REACT } from '../helpers/constants'
import { consumerPropTypes } from '../helpers/propTypes'
import { ConsumerClass } from './ConsumerClass'
import { Context, StappContext } from './Provider'

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
      children: ({ app }: Context) => {
        if (!app) {
          throw new Error(`${STAPP_REACT} error: Provider missing!`)
        }

        return createElement(ConsumerClass, {
          ...this.props,
          app
        })
      }
    })
  }
}
