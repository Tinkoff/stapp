import { createEffect, combineEpics } from 'stapp'
import { loaderStart, loaderEnd } from 'stapp-loaders'
import { setSubmitting, submit, isValidSelector, isReadySelector } from 'stapp-formbase'
import { map, filter, switchMap, switchMapTo } from 'light-observable/operators'
import { of } from 'light-observable/observable'
import { wait } from '../utils/wait'

const isValid = isValidSelector()
const isReady = isReadySelector()

const asyncSubmit = createEffect('Submit', async values => {
  await wait(400)

  window.alert(JSON.stringify(values, 0, 2));
})

const submitEpic = submit.epic((submit$, state$, { getState }) => submit$.pipe(
  map(() => getState()),
  filter(state => isReady(state) & isValid(state)),
  map(state => state.values),
  switchMap(asyncSubmit)
))

const onSubmitStartEpic = asyncSubmit.start.epic(start$ => start$.pipe(
  switchMapTo(of(
    loaderStart('submit'),
    setSubmitting(true)
  ))
))

const onSubmitEndEpic = asyncSubmit.complete.epic(complete$ => complete$.pipe(
  switchMapTo(of(
    loaderEnd('submit'),
    setSubmitting(false)
  ))
))

export const formSubmit = {
  name: 'formSubmit',
  epic: combineEpics([
    submitEpic,
    onSubmitStartEpic,
    onSubmitEndEpic
  ])
}
