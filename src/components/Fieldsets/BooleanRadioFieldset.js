import PropTypes from 'prop-types'
import { useCallback } from 'react'

import RadioInput from '~/components/RadioInput'
import { useField, fieldPropTypes } from '~/hooks/useForm'
import stringToStrictBoolean from '~/util/string/stringToStrictBoolean'

const booleanRadioOptions = [
  {
    value: 'true',
    label: 'Yes',
  },
  {
    value: 'false',
    label: 'No',
  },
]

function BooleanRadioFieldset (props) {
  const {
    children,
    fieldClassName,
    required,
    onChange,
    label,
    ...inputProps
  } = props

  const onValidate = useCallback((value) => {
    return typeof value === 'boolean' || (typeof value === 'undefined' && !required)
  }, [required])

  const { value = undefined, handleChange, submitting } = useField(props.name, { onChange, onValidate })

  const handleWrappedChange = useCallback((event) => {
    handleChange(event, stringToStrictBoolean(event.target.value))
  }, [handleChange])

  return (
    <fieldset className={fieldClassName}>
      <label htmlFor={props.id}>{label}</label>
      <RadioInput
        disabled={submitting}
        {...inputProps}
        options={booleanRadioOptions}
        value={String(value ?? '')}
        onChange={handleWrappedChange} />
      {children}
    </fieldset>
  )
}

BooleanRadioFieldset.propTypes = {
  fieldClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  ...fieldPropTypes,
}





export default BooleanRadioFieldset
