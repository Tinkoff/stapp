import shallowEqual from 'fbjs/lib/shallowEqual'
import { Subscription } from 'light-observable'
import { Component } from 'react'
import { Stapp } from 'stapp'
import { renderComponent } from '../helpers/renderComponent'

import { ConsumerProps } from '../models/Props'

export type AppSubscriptionProps<State, Api, Result> = {
  app: Stapp<State, Api>
} & ConsumerProps<State, Api, Result>

export type AppSubscriptionState<State, Api, Result> = {
  app?: Stapp<State, Api>
  map?: (state: State, api: Api) => Result
  appState?: Result
}

export class AppSubscription<State, Api, Result> extends Component<
  AppSubscriptionProps<State, Api, Result>,
  AppSubscriptionState<State, Api, Result>
> {
  state = {
    app: undefined,
    map: undefined,
    appState: undefined
  }

  private subscription?: Subscription = undefined

  constructor(props: AppSubscriptionProps<State, Api, Result>, context: any) {
    super(props, context)
    this.subscribe(props.app)
  }

  static getDerivedStateFromProps(
    props: AppSubscriptionProps<any, any, any>,
    state: AppSubscriptionState<any, any, any>
  ) {
    const { app, map } = props

    if (app !== state.app || map !== state.map) {
      const appState = map!(app.getState(), app.api)

      return { app, map, appState }
    }

    return null
  }

  componentDidUpdate(
    prevProps: AppSubscriptionProps<State, Api, Result>,
    prevState: AppSubscriptionState<State, Api, Result>
  ) {
    if (this.props.app !== prevProps.app) {
      this.subscribe(this.props.app)
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
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

  private subscribe(app: Stapp<State, Api>) {
    this.unsubscribe()
    this.subscription = app.subscribe((state: State) => this.setAppState(state))
  }

  private unsubscribe() {
    this.subscription && this.subscription.unsubscribe()
    this.subscription = undefined
  }
}
