import { isRequired } from '@fuelrats/validation-util/require'
import { useCallback, useState } from 'react'

/**
 * Hook which safely manages dynamic rendering of a `useForm()` field.
 * This hook should only be used in the form component and not within the fieldset itself.
 * @param {string} name Name of the field
 * @param {object} ctx Form context to attach to. The object returned by `useForm()`
 * @param {boolean} initialState Initial visibility state
 * @param {any} value Initial value to set when mounting the component
 * @param {boolean} validity Initial validity to set when mounting the component
 * @returns {[boolean, function]}
 */
export default function useFieldToggle (name = isRequired('name'), ctx = isRequired('context'), initialState, value, validity = false) {
  const { dispatchField } = ctx
  const [renderField, setState] = useState(Boolean(initialState))

  const setRenderState = useCallback((nextState) => {
    if (nextState) {
      dispatchField({ name, value, valid: validity ?? false })
    } else {
      dispatchField({ name, value: undefined, valid: undefined })
    }

    setState(nextState)
  }, [dispatchField, name, validity, value])

  const toggleRenderState = useCallback(() => {
    setRenderState(!renderField)
  }, [renderField, setRenderState])

  return [renderField, toggleRenderState, setRenderState]
}
