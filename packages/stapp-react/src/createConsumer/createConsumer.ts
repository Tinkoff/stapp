import shallowEqual from 'fbjs/lib/shallowEqual'
import { auditTime, map, skipRepeats, startWith } from 'light-observable/operators'
// tslint:disable-next-line no-unused-variable // declarations
import React, { Component } from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { renderPropType, selectorType } from '../helpers/propTypes'

// Models
import { Observable, Subscription } from 'light-observable'
import { Stapp } from 'stapp/lib/core/createApp/createApp.h'
import { renderComponent } from '../helpers/renderComponent'
import { ConsumerProps } from './createConsumer.h'

/**
 * @private
 */
const consumerPropTypes = {
  render: renderPropType,
  children: renderPropType,
  component: renderPropType,
  map: selectorType
}

/**
 * Creates Consumer component
 */
export const createConsumer = <State, Api>(app: Stapp<State, Api>) => {
  return class Consumer extends Component<ConsumerProps<State, Api, any>> {
    static app = app

    static propTypes = consumerPropTypes

    subscription!: Subscription | void
    selectedResult!: any

    componentWillMount() {
      this.subscribe(this.props)
    }

    componentWillReceiveProps(nextProps: ConsumerProps<State, Api, any>) {
      if (this.props.map !== nextProps.map) {
        this.subscribe(nextProps)
      }
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    subscribe(props: ConsumerProps<State, Api, any>) {
      this.unsubscribe()

      const mapState = props.map || (identity as any)

      this.subscription = Observable.from(app)
        .pipe(
          auditTime(1000 / 60),
          startWith([app.getState()]),
          map((state) => mapState(state, app.api)),
          skipRepeats(shallowEqual)
        )
        .subscribe((result) => {
          this.selectedResult = result
          this.forceUpdate()
        })
    }

    unsubscribe() {
      if (this.subscription) {
        this.subscription.unsubscribe()
        this.subscription = undefined
      }
    }

    shouldComponentUpdate() {
      return false
    }

    render() {
      return renderComponent(
        'Consumer',
        {
          render: this.props.render,
          children: this.props.children,
          component: this.props.component
        },
        this.selectedResult,
        app.api
      )
    }
  }
}
