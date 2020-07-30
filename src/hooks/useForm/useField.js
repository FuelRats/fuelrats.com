import { isRequired } from '@fuelrats/validation-util/require'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import {
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react'

import useDebouncedCallback from '../useDebouncedCallback'
import { FormContext } from './useFormComponent'



function useField (name = isRequired('name'), opts = {}) {
  const { onValidate, onChange, validateOpts } = opts

  const context = useContext(FormContext)
  const { setValidationMethod, validateField, ctx } = context
  const { state, dispatchField, dispatchValidity, submitting } = ctx

  const inputValue = _get(state, name)
  const [validating, setQueueState] = useState(false)

  const debouncedValidate = useDebouncedCallback(
    async (value, curState) => {
      await validateField(name, value, curState)
      setQueueState(false)
    },
    [validateField, name],
    validateOpts ?? { wait: 250 },
  )

  const queueValidation = useCallback((value, curState) => {
    if (onValidate) {
      if (!validating) {
        setQueueState(true)
        dispatchValidity({ name, valid: false })
      }
      debouncedValidate(value, curState)
    }
  }, [onValidate, validating, debouncedValidate, dispatchValidity, name])

  const handleChange = useCallback((event) => {
    onChange?.(event)

    if (event.defaultPrevented) {
      return
    }

    let { value } = event.target
    if (event.target.type === 'checkbox') {
      value = event.target.checked
    }

    dispatchField({ name, value })

    queueValidation(value, state)
  }, [onChange, dispatchField, name, queueValidation, state])

  useEffect(
    () => {
      if (onValidate) {
        setValidationMethod(name, onValidate)
      }

      return () => {
        setValidationMethod(name, undefined)
      }
    },
    [name, onValidate, setValidationMethod],
  )

  return {
    value: inputValue,
    handleChange,
    queueValidation,
    validating,
    submitting,
    ctx,
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
