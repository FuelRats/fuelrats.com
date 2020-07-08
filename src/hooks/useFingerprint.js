import { useState, useEffect } from 'react'

import getFingerprint from '~/helpers/getFingerprint'

export default function useFingerprint () {
  const [fingerprint, setFingerprint] = useState(null)

  useEffect(() => {
    async function fetchData () {
      // You can await here
      const newfingerprint = await getFingerprint()
      setFingerprint(newfingerprint)
      // ...
    }
    fetchData()
  }, [])

  return fingerprint
}
