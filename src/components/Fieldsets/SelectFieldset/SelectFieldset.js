import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback, useRef } from 'react'

import { useField, fieldPropTypes } from '~/hooks/useForm'
import extPropTypes from '~/util/propTypes/extPropTypes'

import inputStyles from '../InputFieldset/InputFieldset.module.scss'
import styles from './SelectFieldset.module.scss'





function SelectFieldset (props) {
  const {
    children,
    className,
    dark,
    disabled,
    fieldsetClassName,
    inputClassName,
    label,
    noEmpty,
    onChange,
    onValidate: parentValidate,
    required,
    placeholder,
    validateOpts,
    ...inputProps
  } = props

  const validityRef = useRef(false)

  const onValidate = useCallback((value = '') => {
    let nextValidity = true
    if (required && value.length < 1) {
      return false
    }

    if (parentValidate) {
      nextValidity = parentValidate(value)
    }

    validityRef.current = nextValidity
    return nextValidity
  }, [parentValidate, required])

  const {
    value = '',
    submitting,
    handleChange,
  } = useField(props.name, { onValidate, onChange, validateOpts })

  return (
    <fieldset className={fieldsetClassName}>
      {
        Boolean(label) && (
          <label htmlFor={props.id}>{label}</label>
        )
      }

      <div className={[inputStyles.inputGroup, styles.select, className]}>
        <select
          className={[inputClassName, { dark, required, valid: validityRef.current, [styles.empty]: !value.length }]}
          disabled={submitting || disabled}
          type="text"
          {...inputProps}
          value={value}
          onChange={handleChange}>
          {
            !noEmpty && (
              <option disabled aria-label="Empty" value="">{placeholder}</option>
            )
          }
          {children}
        </select>
        <div className={styles.arrow}>
          <FontAwesomeIcon fixedWidth icon="angle-down" size="lg" />
        </div>
      </div>
    </fieldset>
  )
}

SelectFieldset.displayName = 'SelectFieldset'

SelectFieldset.propTypes = {
  'aria-label': extPropTypes(PropTypes.string).isRequiredIf('label', 'undefined'),
  dark: PropTypes.bool,
  id: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  label: PropTypes.node,
  noEmpty: PropTypes.bool,
  ...fieldPropTypes,
}





export default SelectFieldset
