// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import classNames from '../helpers/classNames'





class SwitchInput extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      containerProps,
      checked,
      className,
      disabled,
      id,
      label,
    } = this.props

    const containerClasses = classNames(
      'switch-container',
      ['checked', checked],
      ['disabled', disabled],
      [className, className]
    )
    return (
      <div
        {...containerProps}
        className={containerClasses}>
        <div className="switch-background" />
        <div className="switch-handle">
          <FontAwesomeIcon icon={checked ? 'check' : 'times'} fixedWidth />
        </div>
        <input
          {...this.inputProps}
          className="switch-input"
          type="checkbox" />
        {label && (
          <label htmlFor={id} className="switch-label">{label}</label>
        )}
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get inputProps () {
    const inputProps = { ...this.props }

    delete inputProps.className
    delete inputProps.containerProps
    delete inputProps.label

    return inputProps
  }
}





export default SwitchInput
