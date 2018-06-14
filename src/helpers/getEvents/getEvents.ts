import { merge } from '../merge/merge'

// Models
import { Module } from '../../core/createApp/createApp.h'

/**
 * Gets event creators from modules
 * @param modules
 * @private
 */
export const getEvents = <Api>(modules: Array<Module<any, any, any>>): Api =>
  merge(['events', 'api'], modules)
