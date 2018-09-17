import shallowEqual from 'fbjs/lib/shallowEqual'
import { Subscription } from 'light-observable'
import { Component } from 'react'
import { Stapp } from 'stapp'
import { renderComponent } from '../helpers/renderComponent'

import { ConsumerProps } from '../models/Props'

export class ConsumerClass<State, Api> extends Component<
  { app: Stapp<State, Api> } & ConsumerProps<State, Api, any>
> {
  subscription?: Subscription = undefined

  state = {
    appState: null
  }

  componentWillMount() {
    const app = this.props.app

    this.subscription = app.subscribe(this.setAppState.bind(this))
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
    const { app, ...props } = this.props
    const appState = this.state.appState

    return renderComponent({
      name: 'Consumer',
      renderProps: props,
      result: appState,
      api: app.api,
      app
    })
  }
}
