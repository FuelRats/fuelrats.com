import { useCallback } from 'react'

import useEventListener from './useEventListener'





export default function useConfirmUnload (message) {
  const confirmUnload = useCallback((event) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(message)) {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }
    return undefined
  }, [message])

  useEventListener('beforeunload', confirmUnload)
}
