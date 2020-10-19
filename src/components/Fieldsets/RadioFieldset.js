import PropTypes from 'prop-types'
import { useCallback } from 'react'

import RadioInput from '~/components/RadioInput'
import { useField, fieldPropTypes } from '~/hooks/useForm'

function RadioFieldset (props) {
  const {
    children,
    required,
    onChange,
    label,
    ...inputProps
  } = props

  const onValidate = useCallback((value) => {
    return Boolean(value) || !required
  }, [required])

  const { value = '', handleChange, submitting } = useField(props.name, { onChange, onValidate })

  return (
    <fieldset>
      <label htmlFor={props.id}>{label}</label>
      <RadioInput
        disabled={submitting}
        {...inputProps}
        value={value}
        onChange={handleChange} />
      {children}
    </fieldset>
  )
}

RadioFieldset.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  ...fieldPropTypes,
}





export default RadioFieldset
