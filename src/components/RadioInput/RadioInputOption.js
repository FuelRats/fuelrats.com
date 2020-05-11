// Module imports
import PropTypes from 'prop-types'
import React from 'react'





function RadioInputOption (props) {
  const {
    as: Element = 'div',
    className,
    label,
    title,
    value,
    ...inputProps
  } = props

  const optionId = `${inputProps.name}-${value}`

  return (
    <Element className={['option', { disabled: inputProps.disabled, checked: inputProps.checked }, className]}>
      <input
        {...inputProps}
        aria-hidden={false}
        aria-label={label}
        className="option-input"
        id={optionId}
        type="radio"
        value={value} />
      <label
        className="option-label"
        htmlFor={optionId}
        title={title}>
        <span className="option-label-text">
          {label}
        </span>
      </label>
    </Element>
  )
}


RadioInputOption.defaultProps = {
  as: 'div',
  checked: false,
  className: null,
  disabled: false,
}

RadioInputOption.propTypes = {
  as: PropTypes.elementType,
  checked: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.any,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}


export default RadioInputOption
