import shallowEqual from 'fbjs/lib/shallowEqual'
import { Subscription } from 'light-observable'
import { Component } from 'react'
import { Stapp } from 'stapp'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { renderComponent } from '../helpers/renderComponent'

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

  private subscription?: Subscription = undefined

  constructor(props: StappSubscriptionProps<State, Api, Result>, context: any) {
    super(props, context)

    this.state = {
      app: props.app,
      map: props.map,
      appState: props.map!(props.app.getState(), props.app.api)
    }

    this.subscribe(props.app)
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

  componentDidUpdate(
    prevProps: StappSubscriptionProps<State, Api, Result>,
    prevState: StappSubscriptionState<State, Api, Result>
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

  private setAppState(state: State) {
    const app = this.props.app

    this.setState({ appState: this.props.map!(state, app.api) })
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
