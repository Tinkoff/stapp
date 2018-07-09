import shallowEqual from 'fbjs/lib/shallowEqual'
import { auditTime, map, skipRepeats, startWith } from 'light-observable/operators'
import { Component, ComponentClass } from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { defaultMergeProps } from '../helpers/defaultMergeProps'
import { renderPropType, selectorType } from '../helpers/propTypes'

// Models
import { Observable, Subscription } from 'light-observable'
import { Stapp } from 'stapp/lib/core/createApp/createApp.h'
import { renderComponent } from '../helpers/renderComponent'
import { ConsumerProps } from './createConsumer.h'

// tslint:disable-next-line no-unused-variable // Needed for declarations

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

    subscription!: Subscription | void
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

      this.subscription = Observable.from(app)
        .pipe(
          auditTime(1000 / 60),
          startWith([app.getState()]),
          map(getResult),
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
