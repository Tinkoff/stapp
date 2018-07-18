import { createApp } from 'stapp'
import { createComponents } from 'stapp-react'
import { formBase } from 'stapp-formbase'
import { formSubmit } from '../modules/formSubmit'
import { loaders } from 'stapp-loaders'
import { persist, toAsync } from 'stapp-persist'
import { validate } from 'stapp-validate'
import { wait } from '../utils/wait'

const required = (value, fieldName) => {
  console.log(fieldName, value)
  if (!value || value.length === 0) return 'Required!'
}

const checkAge = age => {
  if (age < 18) return 'Age should be greater than 18!'
}

const validateName = async (username) => {
  await wait(1500)
  return ['John', 'Paul', 'George', 'Ringo'].includes(username) ? {
    username: 'Name already taken!'
  } : null
}

const asyncForm = createApp({
  name: 'asyncForm',
  modules: [
    persist({
      key: 'asyncForm',
      storage: toAsync(localStorage),
      blackList: ['validating', 'loaders']
    }),
    formBase(),
    loaders,
    validate({
      rules: {
        age: (age, fieldName) => required(age, fieldName) || checkAge(age, fieldName),
        name: required,
        username: (username, fieldName) => {
          const error = required(username, fieldName)

          if (error) {
            return { username: error }
          }

          return validateName(username)
        }
      }
    }),
    formSubmit
  ]
})

export const { Consumer, Form, Field } = createComponents(asyncForm)
