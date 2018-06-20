// tslint:disable-next-line no-unused-variable // Needed for declarations
import React, { ComponentType } from 'react'

/**
 * @private
 */
export const getDisplayName = (Component: ComponentType<any>): string =>
  Component.displayName || Component.name || 'Unknown'
