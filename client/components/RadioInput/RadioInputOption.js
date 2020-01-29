// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import classNames from '../../helpers/classNames'





const RadioInputOption = (props) => {
  const {
    as: Element = 'div',
    className,
    label,
    title,
    value,
    ...inputProps
  } = props

  const optionId = `${inputProps.name}-${value}`


  const classes = classNames(
    'option',
    className,
    ['disabled', inputProps.disabled],
    ['checked', inputProps.checked],
  )

  return (
    <Element className={classes}>
      <input
        {...inputProps}
        aria-label={label}
        aria-hidden={false}
        id={optionId}
        className="option-input"
        value={value}
        type="radio" />
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
