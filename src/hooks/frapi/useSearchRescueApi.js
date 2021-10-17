import { useEffect, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux'

import { getRescue } from '~/store/actions/rescues'
import { isValidUuidV4 } from '~/util/string/uuidValidator'

const rescueFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        isError: false,
        rescueId: null,
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        rescueId: action.rescueId,
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
        rescueId: null,
      }
    default:
      throw new Error('Wrong action type used')
  }
}

export default function useSearchRescueApi (initialRescueId = null) {
  const [rescueId, setRescueId] = useState(initialRescueId)
  const reduxDispatch = useDispatch()

  const [state, dispatch] = useReducer(rescueFetchReducer, {
    isLoading: false,
    isError: false,
    rescueId: null,
  })

  useEffect(() => {
    let didCancel = false
    const cleanup = () => {
      didCancel = true
    }

    if (typeof rescueId !== 'string' || !isValidUuidV4(rescueId)) {
      return cleanup
    }

    const fetchRescue = async () => {
      dispatch({ type: 'FETCH_START' })

      const result = await reduxDispatch(getRescue(rescueId))

      if (!didCancel) {
        if (result.error) {
          dispatch({ type: 'FETCH_FAILURE' })
        } else {
          dispatch({
            type: 'FETCH_SUCCESS',
            rescueId,
          })
        }
      }
    }

    fetchRescue()

    // Mechanism used to prevent race conditions
    return cleanup
  }, [rescueId, reduxDispatch])

  return [state, setRescueId]
}
