import { isRequired } from '@fuelrats/validation-util'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'

import useDebouncedCallback from '../useDebouncedCallback'
import { useFormContext } from './useFormComponent'





function useField (name = isRequired('name'), opts = {}) {
  const { onValidate, onChange, validateOpts } = opts

  const ctxRef = useRef(null)
  ctxRef.current = useFormContext()

  const inputValue = _get(ctxRef.current?.ctx.state, name)

  // Validation state tracking.
  const [validating, setValidatingState] = useState(false)

  // Use a ref for dirtyState since it only changes on other state changes.
  // Default state is dirty even if we're on initial mount of the form.
  const dirtyState = useRef(true)

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

    if (typeof onValidate === 'function') {
      // Only mark as dirty if we have a validation function to check.
      // The validation check itself is kicked off by the form state change below.
      dirtyState.current = true
    }

    ctxRef.current?.ctx.dispatchField({ name, value })
  }, [onChange, onValidate, name])

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
        // Always set dirtyState back to false just to prevent unncessary validation attempts after form initialization.
        dirtyState.current = false
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
