import { createContext } from 'react'
import { Stapp } from '../../../stapp/lib/core/createApp/createApp.h'

export const StappContext = createContext<Stapp<any, any> | null>(null)
