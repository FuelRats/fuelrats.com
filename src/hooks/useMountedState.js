import { useEffect } from 'react'




/**
 * Calls the given setState with the state object provided. When the component is unmounted, the state is unset
 *
 * This hook is intended for shared state scenarios, and will not account for other changes made while the component is mounted.
 * Use this with care.
 * @param {Function} setState setState function which accepts a state fragment.
 * @param {object} state fragment of state to be updated. Should be defined inline.
 */
export default function useMountedState (setState, state) {
  useEffect(() => {
    setState(state)

    // Hold given entries for later. State should be inline and thus should never change, but we cannot insure that.
    const entries = Object.entries(state)
    return () => {
      // Only clear keys this instance still owns; a later consumer may have
      // overwritten them, and we must not wipe their state.
      setState((current) => {
        return entries.reduce((acc, [key, value]) => {
          if (current[key] === value) {
            acc[key] = undefined
          }
          return acc
        }, {})
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run once.
  }, [])
}
