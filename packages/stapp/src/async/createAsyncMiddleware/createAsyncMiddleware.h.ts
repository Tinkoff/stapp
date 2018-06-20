import { COMPLETE } from '../../helpers/constants'

/**
 * @private
 */
export type CompleteMeta = { [K in typeof COMPLETE]: string | string[] }
