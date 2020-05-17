// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





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

    return (
      <div
        {...containerProps}
        className={['switch-container', { checked, disabled }, className]}>
        <div className="switch-background" />
        <div className="switch-handle">
          <FontAwesomeIcon fixedWidth icon={checked ? 'check' : 'times'} />
        </div>
        <input
          {...this.inputProps}
          className="switch-input"
          type="checkbox" />
        {
          label && (
            <label className="switch-label" htmlFor={id}>{label}</label>
          )
        }
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
