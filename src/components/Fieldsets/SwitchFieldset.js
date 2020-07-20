import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import { useField } from '~/hooks/useForm'

import Switch from '../Switch'





function SwitchFieldset (props) {
  const {
    onChange,
    onValidate:
    parentValidate,
    ...inputProps
  } = props


  const onValidate = useCallback((value) => {
    return onValidate?.(value) ?? (Boolean(value) || !props.required)
  }, [props.required])


  const { value, handleChange } = useField(props.name, { onChange, onValidate })

  return (
    <fieldset>
      <Switch {...inputProps} checked={value} onChange={handleChange} />
    </fieldset>
  )
}

SwitchFieldset.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
}


export default SwitchFieldset
