import PropTypes from 'prop-types'
import React, { useCallback } from 'react'





import styles from './RadioInput.module.scss'
import RadioInputOption from './RadioInputOption'





function RadioInput (props) {
  const {
    as: Element = 'div',
    className,
    disabled,
    name,
    options,
    onChange,
    OptionElement = RadioInputOption,
    value,
  } = props

  const handleOptionClick = useCallback((event) => {
    if (value !== event?.target?.value) {
      onChange(event)
    }
  }, [onChange, value])

  return (
    <Element className={[styles.radioInput, { disabled }, className]}>
      {
        options.map((option) => {
          return (
            <OptionElement
              {...option}
              key={option.value}
              checked={option.value === value ?? option.checked}
              disabled={disabled ?? option.disabled}
              name={name}
              onChange={handleOptionClick} />
          )
        })
      }
    </Element>
  )
}


RadioInput.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  disabled: PropTypes.any,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  OptionElement: PropTypes.elementType,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
}




export default RadioInput
