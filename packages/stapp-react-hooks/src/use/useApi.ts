import { useContext } from 'react'
import { StappContext } from 'stapp-react/lib/context/Provider'

export const useApi = () => {
  const app = useContext(StappContext)
  return app.api
}
