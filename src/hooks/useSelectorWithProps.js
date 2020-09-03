import { useMemo } from 'react'
import { useSelector } from 'react-redux'





export default function useSelectorWithProps (props, selector, equalityFn) {
  return useSelector((state) => {
    return selector(state, props)
  }, equalityFn)
}
