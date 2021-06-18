import { isRequired } from '@fuelrats/validation-util'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'

import useDebouncedCallback from '../useDebouncedCallback'
import { useFormContext } from './useFormComponent'





function useField (name = isRequired('name'), opts = {}) {
  const { onValidate, onChange, validateOpts } = opts

  const nameRef = useRef(name)

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
      await ctxRef.current?.validateField(nameRef.current, value)
      setValidatingState(false)
    },
    [],
    validateOpts ?? { wait: 250 },
  )

  const handleChange = useCallback((event, nextValue) => {
    let { value } = event.target
    if (event.target.type === 'checkbox') {
      value = event.target.checked
    }
    if (typeof nextValue !== 'undefined') {
      value = nextValue
    }

    onChange?.(event, value)

    if (event.defaultPrevented) {
      return
    }

    if (typeof onValidate === 'function') {
      // Only mark as dirty if we have a validation function to check.
      // The validation check itself is kicked off by the form state change below.
      dirtyState.current = true
    }

    ctxRef.current?.ctx.dispatchField({ name: nameRef.current, value })
  }, [onChange, onValidate])

  // Register our validation method for this field
  useEffect(
    () => {
      const currentName = nameRef.current
      if (typeof onValidate === 'function') {
        ctxRef.current?.registerValidator(currentName, onValidate)
      }
      return () => {
        ctxRef.current?.registerValidator(currentName, undefined)
      }
    },
    [onValidate],
  )

  // Clear state value on unmount, but also use this hook as a check for changes to the name variable, which should never change.
  useEffect(
    () => {
      if (nameRef.current !== name) {
        throw new Error('Field names must be static. Dynamically mount another field instead of reassigning an existing field')
      }

      return () => {
        ctxRef.current?.ctx.dispatchField({ name, default: true })
      }
    },
    [name],
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
        ctxRef.current?.ctx.dispatchValidity({ name: nameRef.current, valid: false })
      }

      debouncedValidate(inputValue)
    },
    [debouncedValidate, inputValue, onValidate, validating],
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
