import { createSubscription } from 'create-subscription'
import { Stapp } from 'stapp'

export const Subscription = createSubscription<Stapp<any, any>, any>({
  getCurrentValue(app) {
    return app.getState()
  },
  subscribe(app, callback) {
    const subscription = app.subscribe(callback)
    return () => subscription.unsubscribe()
  }
})
