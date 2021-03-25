import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback, useRef } from 'react'

import extPropType from '~/helpers/extPropTypes'
import { useField, fieldPropTypes } from '~/hooks/useForm'

import inputStyles from '../InputFieldset/InputFieldset.module.scss'
import ValidityIcon from '../InputFieldset/ValidityIcon'
import styles from './SelectFieldset.module.scss'





function SelectFieldset (props) {
  const {
    children,
    className,
    dark,
    disabled,
    inputClassName,
    label,
    noEmpty,
    onChange,
    onValidate: parentValidate,
    required,
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
    validating,
    submitting,
    handleChange,
  } = useField(props.name, { onValidate, onChange, validateOpts })

  return (
    <fieldset>
      {
        Boolean(label) && (
          <label htmlFor={props.id}>{label}</label>
        )
      }

      <div className={[inputStyles.inputGroup, styles.select, className]}>
        <select
          className={[inputClassName, { dark, required, valid: validityRef.current }]}
          disabled={submitting || disabled}
          type="text"
          {...inputProps}
          value={value}
          onChange={handleChange}>
          {
            !noEmpty && (
              <option aria-label="Empty" value="" />
            )
          }
          {children}
        </select>
        <div className={styles.arrow}>
          <FontAwesomeIcon fixedWidth icon="angle-down" size="lg" />
        </div>
        <ValidityIcon
          className={{ [inputStyles.hidden]: !value.length }}
          valid={validityRef.current}
          validating={validating} />
      </div>
    </fieldset>
  )
}

SelectFieldset.displayName = 'InputFieldset'

SelectFieldset.propTypes = {
  'aria-label': extPropType(PropTypes.string).isRequiredIf('label', 'undefined'),
  dark: PropTypes.bool,
  id: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  label: PropTypes.node,
  noEmpty: PropTypes.bool,
  ...fieldPropTypes,
}





export default SelectFieldset
