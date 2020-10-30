import { Children, isValidElement, useMemo } from 'react'



export function useChildCount (children) {
  return useMemo(() => {
    return Children.count(children)
  }, [children])
}

export function useRenderedChildCount (children) {
  return useMemo(() => {
    return Children.toArray(children).filter((child) => {
      return isValidElement(child)
    }).length
  }, [children])
}
