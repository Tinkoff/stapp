import shallowEqual from 'fbjs/lib/shallowEqual'
// tslint:disable-next-line no-unused-variable // Needed for declarations
import { Component, ComponentClass } from 'react'
import { debounceTime } from 'rxjs/operators/debounceTime'
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged'
import { map } from 'rxjs/operators/map'
import { startWith } from 'rxjs/operators/startWith'
import { animationFrame } from 'rxjs/scheduler/animationFrame'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { defaultMergeProps } from '../helpers/defaultMergeProps'
import { renderPropType, selectorType } from '../helpers/propTypes'

// Models
import { Subscription } from 'rxjs/Subscription'
import { Stapp } from 'stapp/lib/core/createApp/createApp.h'
import { renderComponent } from '../helpers/renderComponent'
import { ConsumerProps } from './createConsumer.h'

// tslint:disable-next-line no-unused-variable // Needed for declarations
// import { Requireable } from 'prop-types'

/**
 * @private
 */
const consumers: { [K: string]: ComponentClass<ConsumerProps<any, any, any, any, any>> } = {}

/**
 * @private
 */
const consumerPropTypes = {
  render: renderPropType,
  children: renderPropType,
  component: renderPropType,
  mapState: selectorType,
  mapApi: selectorType
}

/**
 * Creates Consumer component
 */
export const createConsumer = <State, Api>(
  app: Stapp<State, Api>
): ComponentClass<ConsumerProps<State, Api, any, any, any>> => {
  if (consumers[app.name]) {
    return consumers[app.name]
  }

  return (consumers[app.name] = class Consumer extends Component<
    ConsumerProps<State, Api, any, any, any>
  > {
    static propTypes = consumerPropTypes

    subscription!: Subscription
    selectedResult!: any

    componentWillMount() {
      this.subscribe(this.props)
    }

    componentWillReceiveProps(nextProps: ConsumerProps<State, Api, any, any, any>) {
      if (
        this.props.mapApi !== nextProps.mapApi ||
        this.props.mapState !== nextProps.mapState ||
        this.props.mergeProps !== nextProps.mergeProps
      ) {
        this.subscribe(nextProps)
      }
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    subscribe(props: ConsumerProps<State, Api, any, any, any>) {
      this.unsubscribe()

      const mapState = props.mapState || (identity as any)
      const mapApi = props.mapApi || (identity as any)
      const mergeProps = props.mergeProps || defaultMergeProps

      const getResult = (state: State) => mergeProps(mapState(state), mapApi(app.api))

      this.subscription = app.state$
        .pipe(
          debounceTime(1000 / 60, animationFrame),
          startWith(app.getState()),
          map(getResult),
          distinctUntilChanged(shallowEqual)
        )
        .subscribe((result) => {
          this.selectedResult = result
          this.forceUpdate()
        })
    }

    unsubscribe() {
      this.subscription && this.subscription.unsubscribe()
    }

    shouldComponentUpdate() {
      return false
    }

    render() {
      return renderComponent(
        {
          render: this.props.render,
          children: this.props.children,
          component: this.props.component
        },
        this.selectedResult,
        'Consumer'
      )
    }
  })
}
