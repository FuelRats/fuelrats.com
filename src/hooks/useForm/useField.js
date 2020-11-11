import { isRequired } from '@fuelrats/validation-util'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'

import useDebouncedCallback from '../useDebouncedCallback'
import { useFormContext } from './useFormComponent'





function useField (name = isRequired('name'), opts = {}) {
  const { onValidate, onChange, validateOpts, dirtyMount = false } = opts

  const ctxRef = useRef(null)
  ctxRef.current = useFormContext()

  const inputValue = _get(ctxRef.current?.ctx.state, name)

  // Validation state tracking.
  // Use a ref for dirtyState since it only changes on other state changes.
  const dirtyState = useRef(dirtyMount)
  const [validating, setValidatingState] = useState(false)

  const debouncedValidate = useDebouncedCallback(
    async (value) => {
      dirtyState.current = false
      await ctxRef.current?.validateField(name, value, ctxRef.current?.ctx.state)
      setValidatingState(false)
    },
    [name],
    validateOpts ?? { wait: 250 },
  )

  const handleChange = useCallback((event) => {
    onChange?.(event)

    if (event.defaultPrevented) {
      return
    }

    let { value } = event.target
    if (event.target.type === 'checkbox') {
      value = event.target.checked
    }
    dirtyState.current = true
    ctxRef.current?.ctx.dispatchField({ name, value })
  }, [onChange, name])

  // Register our validation method for this field
  useEffect(
    () => {
      if (typeof onValidate === 'function') {
        ctxRef.current?.registerValidator(name, onValidate)
      }
      return () => {
        ctxRef.current?.registerValidator(name, undefined)
      }
    },
    [name, onValidate],
  )

  // validate whenever the field is marked as dirty
  useEffect(
    () => {
      if (typeof onValidate !== 'function' || !dirtyState.current || !ctxRef.current?.ctx.isInit) {
        return
      }

      if (!validating) {
        setValidatingState(true)
        ctxRef.current?.ctx.dispatchValidity({ name, valid: false })
      }

      debouncedValidate(inputValue)
    },
    [debouncedValidate, inputValue, name, onValidate, validating],
  )

  return {
    value: inputValue,
    handleChange,
    validating,
    submitting: ctxRef.current?.ctx.submitting,
    ctx: ctxRef.current?.ctx,
  }
}

const fieldPropTypes = {
  name: PropTypes.string.isRequired,
  onValidate: PropTypes.func,
}



export default useField
export {
  fieldPropTypes,
}
