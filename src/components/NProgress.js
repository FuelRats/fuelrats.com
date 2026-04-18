import Router from 'next/router'
import NProgressLib from 'nprogress'
import { useEffect } from 'react'




// Component constants
const MINIMUM_CHANGE_TIME = 250




function NProgress ({ minimum = 0.15, showSpinner = false, ...config }) {
  useEffect(() => {
    NProgressLib.configure({ minimum, showSpinner, ...config })

    let timer = null
    const handleRouteChangeStart = () => {
      clearTimeout(timer)
      timer = setTimeout(NProgressLib.start, MINIMUM_CHANGE_TIME)
    }
    const handleRouteChangeDone = () => {
      clearTimeout(timer)
      NProgressLib.done()
    }

    Router.events.on('routeChangeStart', handleRouteChangeStart)
    Router.events.on('routeChangeComplete', handleRouteChangeDone)
    Router.events.on('routeChangeError', handleRouteChangeDone)

    return () => {
      clearTimeout(timer)
      Router.events.off('routeChangeStart', handleRouteChangeStart)
      Router.events.off('routeChangeComplete', handleRouteChangeDone)
      Router.events.off('routeChangeError', handleRouteChangeDone)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only
  }, [])

  return null
}




export default NProgress
