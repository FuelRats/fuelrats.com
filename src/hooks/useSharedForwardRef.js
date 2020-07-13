import { useRef, useEffect } from 'react'





export default function useSharedForwardRef (forwardRef) {
  const ref = useRef()

  useEffect(() => {
    if (forwardRef) {
      if (typeof forwardRef === 'function') {
        forwardRef(ref.current)
      } else {
        // eslint-disable-next-line no-param-reassign
        forwardRef.current = ref.current
      }
    }
  })

  return ref
}
