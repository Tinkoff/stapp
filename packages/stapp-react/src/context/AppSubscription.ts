import shallowEqual from 'fbjs/lib/shallowEqual'
import { Subscription } from 'light-observable'
import { Component } from 'react'
import { Stapp } from 'stapp'
import { renderComponent } from '../helpers/renderComponent'

import { ConsumerProps } from '../models/Props'

export type AppSubscriptionProps<State, Api, Result> = {
  app: Stapp<State, Api>
} & ConsumerProps<State, Api, Result>

export type AppSubscriptionState<Result> = { appState?: Result }

export class AppSubscription<State, Api, Result> extends Component<
  AppSubscriptionProps<State, Api, Result>,
  AppSubscriptionState<Result>
> {
  subscription?: Subscription = undefined

  state = {
    appState: undefined
  }

  constructor(props: AppSubscriptionProps<State, Api, Result>, context: any) {
    super(props, context)
    const app = props.app

    this.subscription = app.subscribe((state: State) => this.setAppState(state))
  }

  static getDerivedStateFromProps(
    props: AppSubscriptionProps<any, any, any>,
    state: AppSubscriptionState<any>
  ) {
    const { app, map } = props
    const appState = map!(app.getState(), app.api)

    if (!shallowEqual(state.appState, appState)) {
      return { appState }
    }

    return null
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe()
  }

  shouldComponentUpdate(nextProps: any, nextState: { appState: any }) {
    return !shallowEqual(this.state.appState, nextState.appState)
  }

  setAppState(state: State) {
    const app = this.props.app

    this.setState({ appState: this.props.map!(state, app.api) })
  }

  render() {
    const app = this.props.app
    const appState = this.state.appState

    return renderComponent({
      name: 'Consumer',
      renderProps: this.props,
      result: appState,
      api: app.api,
      app
    })
  }
}
