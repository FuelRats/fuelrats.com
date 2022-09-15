import { isRequired } from '@fuelrats/validation-util'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'

import useDebouncedCallback from '../useDebouncedCallback'
import { useFormContext } from './useFormComponent'





function useField (name = isRequired('name'), opts = {}) {
  const { onValidate, onChange, validateOpts, validateDeps } = opts

  const ctxRef = useRef(null)
  ctxRef.current = useFormContext()

  const inputValue = _get(ctxRef.current?.ctx.state, name)

  // Validation state tracking.
  const [validating, setValidatingState] = useState(false)

  const metaRef = useRef({
    dirty: true,
    name,
    validating,
  })
  metaRef.current.validating = validating

  const debouncedValidate = useDebouncedCallback(
    async (value) => {
      metaRef.current.dirty = false
      await ctxRef.current?.validateField(name, value)
      setValidatingState(false)
    },
    [name],
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
      metaRef.current.dirty = true
    }

    ctxRef.current?.ctx.dispatchField({ name, value })
  }, [name, onChange, onValidate])

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

  // Clear state value on unmount, but also use this hook as a check for changes to the name variable, which should never change.
  useEffect(
    () => {
      if (metaRef.current.name !== name) {
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
      if (typeof onValidate !== 'function' || !metaRef.current.dirty || !ctxRef.current?.ctx.isInit) {
        // Always set dirtyState back to false just to prevent unncessary validation attempts after form initialization.
        metaRef.current.dirty = false
        return
      }

      if (!metaRef.current.validating) {
        setValidatingState(true)
        ctxRef.current?.ctx.dispatchValidity({ name, valid: false })
      }

      debouncedValidate(inputValue)
    },
    [debouncedValidate, inputValue, name, onValidate],
  )

  useEffect(
    () => {
      if (typeof onValidate !== 'function' || !ctxRef.current?.ctx.isInit) {
        return
      }

      if (!metaRef.current.validating) {
        setValidatingState(true)
        ctxRef.current?.ctx.dispatchValidity({ name, valid: false })
      }

      debouncedValidate(inputValue)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run this code when this deps array changes.
    Array.isArray(validateDeps) ? validateDeps : [validateDeps],
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
