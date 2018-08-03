import shallowEqual from 'fbjs/lib/shallowEqual'
import { auditTime, map, skipRepeats } from 'light-observable/operators'
// tslint:disable-next-line no-unused-variable // declarations
import React, { Component } from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { renderPropType, selectorType } from '../helpers/propTypes'

// Models
import { Observable, Subscription } from 'light-observable'
import { Stapp } from 'stapp'
import { renderComponent } from '../helpers/renderComponent'
import { ConsumerClass, ConsumerProps } from './createConsumer.h'

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
export const createConsumer = <State, Api>(
  app: Stapp<State, Api>
): ConsumerClass<State, Api, any> => {
  return class Consumer extends Component<
    ConsumerProps<State, Api, any>,
    { appState: any }
  > {
    static app = app
    static propTypes = consumerPropTypes
    static displayName = `${app.name}.Consumer`
    static defaultProps = {
      map: identity
    }

    subscription!: Subscription | void

    state = {
      appState: this.props.map!(app.getState(), app.api)
    }

    componentDidMount() {
      this.subscribe()
    }

    componentDidUpdate(prevProps: ConsumerProps<State, Api, any>) {
      if (prevProps.map !== this.props.map) {
        this.subscribe()
      }
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    subscribe() {
      this.unsubscribe()

      this.subscription = Observable.from(app as any)
        .pipe(
          auditTime(1000 / 60),
          map((state: State) => this.props.map!(state, app.api)),
          skipRepeats(shallowEqual)
        )
        .subscribe((result) => {
          this.setState(() => ({
            appState: result
          }))
        })
    }

    unsubscribe() {
      if (this.subscription) {
        this.subscription.unsubscribe()
        this.subscription = undefined
      }
    }

    shouldComponentUpdate(
      nextProps: ConsumerProps<State, Api, any>,
      nextState: { appState: any }
    ) {
      return (
        nextState.appState !== this.state.appState ||
        nextProps.map !== this.props.map ||
        nextProps.children !== this.props.children ||
        nextProps.component !== this.props.component ||
        nextProps.render !== this.props.render
      )
    }

    render() {
      return renderComponent(
        'Consumer',
        {
          render: this.props.render,
          children: this.props.children,
          component: this.props.component
        },
        this.state.appState,
        app.api
      )
    }
  }
}
