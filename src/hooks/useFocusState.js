import { useState, useCallback, useRef } from 'react'





export default function useFocusState ({ touched = false, onTouched, onBlur, onFocus }) {
  const isTouched = useRef(touched)
  const [isFocused, setFocused] = useState(false)



  const handleFocus = useCallback(() => {
    if (!isTouched.current) {
      isTouched.current = true
      onTouched?.()
    }
    setFocused(true)
    onFocus?.()
  }, [onFocus, onTouched])

  const handleBlur = useCallback(() => {
    setFocused(false)
    onBlur?.()
  }, [onBlur])


  return [isFocused, handleFocus, handleBlur]
}
