import { useEffect, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux'

import { isValidUuidV4 } from '~/helpers/uuidValidator'
import { createEpic } from '~/store/actions/epics'

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

export default function useCreateEpicApi () {
  const [createEpicData, setCreateEpic] = useState({
    rescueId: null,
    notes: null,
    nomineeIds: [],
  })
  const reduxDispatch = useDispatch()

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

    if (typeof createEpicData.rescueId === 'string' && !isValidUuidV4(createEpicData.rescueId)) {
      return cleanup
    }

    if (typeof createEpicData.notes !== 'string' || createEpicData.nomineeIds.length === 0) {
      return cleanup
    }

    const createEpicCall = async () => {
      dispatch({ type: 'CREATE_START' })

      const postBody = {
        attributes: {
          notes: createEpicData.notes,
        },
        relationships: {
          nominees: {
            data: createEpicData.nomineeIds.map((userId) => {
              return {
                type: 'users',
                id: userId,
              }
            }),
          },
        },
      }

      if (createEpicData.rescueId) {
        postBody.relationships.rescue = {
          data: {
            type: 'rescues',
            id: createEpicData.rescueId,
          },
        }
      }

      const result = await reduxDispatch(createEpic(postBody))

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
