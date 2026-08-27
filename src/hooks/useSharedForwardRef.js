import { useRef, useEffect } from 'react'





export default function useSharedForwardRef (forwardRef) {
  const ref = useRef()

  useEffect(() => {
    if (!forwardRef) {
      return undefined
    }

    if (typeof forwardRef === 'function') {
      forwardRef(ref.current)
    } else {
      // eslint-disable-next-line no-param-reassign
      forwardRef.current = ref.current
    }

    return () => {
      if (typeof forwardRef === 'function') {
        forwardRef(null)
      } else {
        // eslint-disable-next-line no-param-reassign
        forwardRef.current = null
      }
    }
  }, [forwardRef])

  return ref
}
