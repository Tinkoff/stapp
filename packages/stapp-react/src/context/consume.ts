import { createConsume } from '../binded/createConsume'
import { Consumer } from './Consumer'

export const consume = createConsume(Consumer)
export const inject = consume
