import { isRequired } from '@fuelrats/validation-util'
import _get from 'lodash/get'
import {
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react'

import useDeltaReducer from '../useDeltaReducer'
import useObjectReducer from '../useObjectReducer'
import useValidityReducer from '../useValidityReducer'
import useFormComponent from './useFormComponent'





export default function useForm (config = {}) {
  const {
    data: initialState = {},
    onSubmit: parentSubmit,
    trackDelta,
  } = config

  const initialStateRef = useRef(initialState)

  const [submitting, setSubmit] = useState(false)

  const [{ __init }, isValid, dispatchValidity] = useValidityReducer({ __init: false })
  const [stateDelta, dispatchDelta] = useDeltaReducer(initialStateRef.current)
  const [state, dispatchState] = useObjectReducer(initialStateRef.current)
  const validationMethods = useRef({})

  const dispatchField = useCallback(
    (action) => {
      if (action.default) {
        dispatchField({
          name: action.name,
          value: _get(initialStateRef.current, action.name),
          valid: action.valid,
        })
        return
      }

      if (Reflect.has(action, 'value')) {
        dispatchState(action)
        if (trackDelta) {
          dispatchDelta(action)
        }
      }
      if (Reflect.has(action, 'valid')) {
        dispatchValidity(action)
      }
    },
    [dispatchDelta, dispatchState, dispatchValidity, trackDelta],
  )

  const registerValidator = useCallback(
    (name = isRequired('name'), callback) => {
      if (typeof callback === 'function') {
        validationMethods.current[name] = callback
      } else {
        delete validationMethods.current[name]
      }
    },
    [],
  )

  const validateAll = useCallback(
    async (curState) => {
      const fragment = { __init: true }

      await Promise.all(Object.entries(validationMethods.current).map(
        async ([name, func]) => {
          fragment[name] = await func(_get(curState, name))
        },
      ))

      dispatchValidity({ fragment })
    },
    [dispatchValidity],
  )

  const validateField = useCallback(
    async (name, value) => {
      const validationMethod = validationMethods.current[name]
      if (validationMethod) {
        const valid = await validationMethod(value)
        dispatchValidity({ name, valid })
      }
    },
    [dispatchValidity],
  )

  const resetForm = useCallback(() => {
    dispatchState({ fragment: initialStateRef.current })
    validateAll(initialStateRef.current)
    if (trackDelta) {
      dispatchDelta({ clear: true })
    }
  }, [dispatchDelta, dispatchState, trackDelta, validateAll])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      setSubmit(true)
      await parentSubmit(state, stateDelta, resetForm)
      setSubmit(false)
    },
    [parentSubmit, resetForm, state, stateDelta],
  )

  const ctxRef = useRef({ ctx: {} })
  ctxRef.current = useMemo(
    () => {
      return {
        ctx: {
          state,
          canSubmit: Boolean(isValid && !submitting),
          isValid,
          isInit: __init !== false,
          submitting,
          dispatchField,
          dispatchValidity,
          resetForm,
        },
        registerValidator,
        validateAll,
        validateField,
        handleSubmit,
      }
    },
    [
      __init, dispatchField, dispatchValidity, resetForm,
      handleSubmit, isValid, registerValidator,
      state, submitting, validateAll,
      validateField,
    ],
  )
  ctxRef.current.ctx.Form = useFormComponent(ctxRef.current)

  return ctxRef.current.ctx
}
