import { useEffect, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux'

import { createEpic } from '~/store/actions/epics'

export default function useCreateEpicApi () {
  const [createEpicData, setCreateEpic] = useState({
    rescueId: null,
    notes: null,
    nomineeIds: [],
  })
  const reduxDispatch = useDispatch()

  const rescueFetchReducer = (state, action) => {
    switch (action.type) {
      case 'CREATE_START':
        return {
          ...state,
          isLoading: true,
          isError: false,
          epicId: null,
        }
      case 'CREATE_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          epicId: action.epicId,
        }
      case 'CREATE_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
          epicId: null,
        }
      default:
        throw new Error('Wrong action type used')
    }
  }

  const [state, dispatch] = useReducer(rescueFetchReducer, {
    isLoading: false,
    isError: false,
    epicId: null,
  })

  useEffect(() => {
    let didCancel = false
    const cleanup = () => {
      didCancel = true
    }

    if (typeof createEpicData.rescueId !== 'string' || !createEpicData.rescueId.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/u)) {
      return cleanup
    }

    // eslint-disable-next-line consistent-return
    const createEpicCall = async () => {
      dispatch({ type: 'CREATE_START' })

      if (typeof createEpicData.rescueId !== 'string' || !createEpicData.rescueId.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/u)) {
        dispatch({ type: 'CREATE_FAILURE' })
        return cleanup
      }
      const result = await reduxDispatch(createEpic({
        attributes: {
          notes: createEpicData.notes,
        },
        relationships: {
          rescue: {
            data: {
              type: 'rescues',
              id: createEpicData.rescueId,
            },
          },
          nominees: {
            data: createEpicData.nomineeIds.map((userId) => {
              return {
                type: 'users',
                id: userId,
              }
            }),
          },
        },
      }))

      if (!didCancel) {
        if (result.error) {
          dispatch({ type: 'CREATE_FAILURE' })
        } else {
          dispatch({
            type: 'CREATE_SUCCESS',
            epicId: result.payload.data.id,
          })
        }
      }
    }

    createEpicCall()

    // Mechanism used to prevent race conditions
    return cleanup
  }, [createEpicData, reduxDispatch])

  return [state, setCreateEpic]
}
