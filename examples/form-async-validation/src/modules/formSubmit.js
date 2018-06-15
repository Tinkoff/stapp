import { createEffect, selectArray, combineEpics } from 'stapp'
import { setSubmitting, submit } from 'stapp/lib/modules/formBase'
import { createSelector } from 'reselect'
import { of } from 'rxjs/observable/of'
import { switchMap } from 'rxjs/operators/switchMap'
import { filter } from 'rxjs/operators/filter'
import { mergeMapTo } from 'rxjs/operators/mergeMapTo'
import { map } from 'rxjs/operators/map'
import { sample } from 'rxjs/operators/sample'
import { loaderStart, loaderEnd } from 'stapp/lib/modules/loaders'
import { wait } from '../utils/wait'

const hasNoErrors = createSelector(
  state => state.errors,
  errors => Object.keys(errors).every(key => !errors[key])
)
const allReady = createSelector(
  state => state.ready,
  ready => Object.keys(ready).every(key => !!ready[key])
)

const asyncSubmit = createEffect('Submit', async values => {
  await wait(400)

  window.alert(JSON.stringify(values, 0, 2));
})

const submitEpic = submit.epic((submit$, state$) => state$.pipe(
  sample(submit$),
  filter(state => allReady(state) & hasNoErrors(state)),
  map(state => state.values),
  switchMap(values => asyncSubmit(values))
))

const onSubmitStartEpic = asyncSubmit.start.epic(start$ => start$.pipe(
  mergeMapTo(of(
    loaderStart('submit'),
    setSubmitting(true)
  ))
))

const onSubmitEndEpic = (event$) => selectArray([asyncSubmit.fail, asyncSubmit.success], event$).pipe(
  mergeMapTo(of(
    loaderEnd('submit'),
    setSubmitting(false)
  ))
)

export const formSubmit = {
  name: 'formSubmit',
  epic: combineEpics([
    submitEpic,
    onSubmitStartEpic,
    onSubmitEndEpic
  ])
}
