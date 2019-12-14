// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import classNames from '../../helpers/classNames'





const RadioInputOption = ({
  option,
  ...inputProps
}) => {
  const {
    as: Element = 'div',
    className,
    label,
    title,
    value,
    ...inputOptions
  } = option
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
        {...inputOptions}
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


RadioInputOption.propTypes = {
  name: PropTypes.string.isRequired,
  option: PropTypes.shape({
    className: PropTypes.string,
    disabled: PropTypes.any,
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
  }).isRequired,
}


export default RadioInputOption
