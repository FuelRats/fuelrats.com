import _debounce from 'lodash/debounce'
import { useCallback } from 'react'

export default function useDebouncedCallback (callback, deps, opts = 0) {
  let wait = opts
  let _opts = {}

  if (typeof opts === 'object') {
    ({ wait, ..._opts } = opts)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- Yeah this is fine :D
  return useCallback(
    _debounce(callback, wait, _opts),
    [wait, _opts.leading, _opts.maxWait, _opts.trailing, ...deps],
  )
}
