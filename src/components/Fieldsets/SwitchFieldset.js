import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import { useField } from '~/hooks/useForm'

import Switch from '../Switch'





function SwitchFieldset (props) {
  const {
    onChange,
    onValidate: parentValidate,
    ...inputProps
  } = props


  const onValidate = useCallback((value) => {
    return parentValidate?.(value) ?? Boolean(value)
  }, [parentValidate])

  const { value = false, handleChange } = useField(props.name, {
    onChange,
    onValidate: inputProps.required ? onValidate : undefined,
  })

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
