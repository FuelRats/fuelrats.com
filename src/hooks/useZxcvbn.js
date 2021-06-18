import { useEffect, useState } from 'react'



const loadTimeoutTimer = 45000 // 45s
let zxcvbn = null



export default function useZxcvbn () {
  const [isLoading, setLoadState] = useState(false)

  useEffect(() => {
    let loaderTimeout = null

    const loadZxcvbn = async () => {
      setLoadState(true)
      loaderTimeout = setTimeout(() => {
        setLoadState(false)
      }, loadTimeoutTimer)

      zxcvbn = (await import(/* webpackChunkName: "zxcvbn-async" */ 'zxcvbn')).default

      clearTimeout(loaderTimeout)
      setLoadState(false)
    }

    if (!zxcvbn) {
      loadZxcvbn()
    }

    return () => {
      clearTimeout(loaderTimeout)
    }
  }, [])

  return [zxcvbn, isLoading]
}
