import pt from 'prop-types'

/**
 * @private
 */
export const renderPropType = pt.func

/**
 * @private
 */
export const selectorType = pt.func

/**
 * @private
 */
export const consumerPropTypes = {
  render: renderPropType,
  children: renderPropType,
  component: renderPropType,
  map: pt.func
}
