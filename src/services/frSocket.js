import ReduxRatSocket from '@fuelrats/web-util/redux-ratsocket'
import Cookies from 'js-cookie'
import getConfig from 'next/config'
import qs from 'qs'
import { useEffect } from 'react'

import { updatesResources } from '~/store/reducers/frAPIResources'




const { publicRuntimeConfig } = getConfig()
const socketUrl = publicRuntimeConfig.apis.fuelRats.socket



const frSocket = new ReduxRatSocket(
  socketUrl,
  {
    transformAction (action) {
      return {
        ...action,
        meta: {
          ...action.meta,
          ...updatesResources(),
        },
      }
    },
  },
)


/**
 * A hook which connects ReduxEventSource to the fr API while mounted. Once unmounted, it will disconnect.
 */
function useRatSocket () {
  useEffect(() => {
    // do nothing in server render.
    if (typeof window !== 'undefined') {
      const token = Cookies.get('access_token')

      if (token) {
        frSocket.connect(qs.stringify({ bearer: token }))
      }
    }

    return () => {
      frSocket.close()
    }
  }, [])
}


export default frSocket
export { useRatSocket }
