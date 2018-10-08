import shallowEqual from 'fbjs/lib/shallowEqual'
import { Subscription } from 'light-observable'
import { Component } from 'react'
import { Stapp } from 'stapp'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { renderComponent } from './renderComponent'

import { ConsumerProps } from '../models/Props'

export type StappSubscriptionProps<State, Api, Result> = {
  app: Stapp<State, Api>
} & ConsumerProps<State, Api, Result>

export type StappSubscriptionState<State, Api, Result> = {
  app?: Stapp<State, Api>
  map?: (state: State, api: Api) => Result
  appState?: Result
}

export class StappSubscription<State, Api, Result> extends Component<
  StappSubscriptionProps<State, Api, Result>,
  StappSubscriptionState<State, Api, Result>
> {
  static defaultProps = {
    map: identity
  }

  static getDerivedStateFromProps(
    props: StappSubscriptionProps<any, any, any>,
    state: StappSubscriptionState<any, any, any>
  ) {
    const { app, map } = props

    if (app !== state.app || map !== state.map) {
      const appState = map!(app.getState(), app.api)

      return { app, map, appState }
    }

    return null
  }

  state = {
    app: this.props.app,
    map: this.props.map,
    appState: this.props.map!(this.props.app.getState(), this.props.app.api)
  }

  private unmounted: boolean = false
  private subscription?: Subscription = undefined

  componentDidMount() {
    this.subscribe()
  }

  componentDidUpdate(
    prevProps: StappSubscriptionProps<State, Api, Result>,
    prevState: StappSubscriptionState<State, Api, Result>
  ) {
    if (this.props.app !== prevProps.app) {
      this.unsubscribe()
      this.subscribe()
    }
  }

  componentWillUnmount() {
    this.unmounted = true
    this.unsubscribe()
  }

  shouldComponentUpdate(
    _: any,
    nextState: StappSubscriptionState<State, Api, Result>
  ) {
    return !shallowEqual(this.state.appState, nextState.appState)
  }

  render() {
    const app = this.props.app
    const appState = this.state.appState

    return renderComponent({
      name: 'StappSubscription',
      renderProps: this.props,
      result: appState,
      api: app.api,
      app
    })
  }

  private subscribe() {
    const { app } = this.props

    this.subscription = app.subscribe((state: State) => {
      /* istanbul ignore next */
      if (this.unmounted) {
        return
      }

      this.setState({ appState: this.props.map!(state, app.api) })
    })
  }

  private unsubscribe() {
    this.subscription && this.subscription.unsubscribe()
    this.subscription = undefined
  }
}
