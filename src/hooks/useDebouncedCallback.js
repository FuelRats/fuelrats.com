import _debounce from 'lodash/debounce'
import { useMemo, useRef } from 'react'

import { resolveOptsOrSimple } from '~/util/resolveOptsOrSimple'



export default function useDebouncedCallback (callback, deps, opts = 0) {
  const {
    wait = 0,
    ...restOpts
  } = resolveOptsOrSimple(opts, 'wait')

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const debounceCallback = useMemo(
    () => {
      return _debounce(
        (...args) => {
          return callbackRef.current(...args)
        },
        wait,
        restOpts,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we can't desctructure these options to satisfy rule because debounce internally uses `in` checks.
    [wait, restOpts.leading, restOpts.maxWait, restOpts.trailing],
  )

  return useMemo(() => {
    const wrapped = (...args) => {
      return debounceCallback(...args)
    }
    wrapped.cancel = () => {
      return debounceCallback.cancel()
    }
    wrapped.flush = () => {
      return debounceCallback.flush()
    }
    wrapped.immediate = (...args) => {
      debounceCallback.cancel()
      return callbackRef.current(...args)
    }
    return wrapped
  // eslint-disable-next-line react-hooks/exhaustive-deps -- We're emulating useCallback here with some extra logic, so static deps not avilable.
  }, [debounceCallback, ...deps])
}
