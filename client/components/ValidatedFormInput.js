// Module imports
import React from 'react'
import PropTypes from 'prop-types'
import classNames from '../helpers/classNames'




class ValidatedFormInput extends React.Component {
  /***************************************************************************\
    Class Propreties
  \***************************************************************************/

  state = {
    errorMessage: '',
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/


  _checkValidity = (target) => {
    const {
      invalidMessage,
      label,
      pattern,
      patternMessage,
      required,
    } = this.props
    const {
      value,
    } = target

    let valid = true
    let message = null

    if (!target.validity.valid) {
      valid = false
      message = invalidMessage || `${label} is invalid`
    }

    if (required && value === '') {
      valid = false
      message = `${label} is Required`
    }

    if (pattern && !value.match(pattern)) {
      valid = false
      message = patternMessage
    }

    this.setState({ errorMessage: message })
    return ({
      target,
      valid,
      message,
    })
  }

  _handleChange = ({ target }) => {
    const {
      doubleValidate,
      onChange,
    } = this.props
    onChange(this._checkValidity(target))

    // Workaround so that we don't get invalid input states when we shouldn't.. because firefox can't update things in the correct order I guess.
    if (doubleValidate) {
      setTimeout(() => {
        onChange(this._checkValidity(target))
      }, 1)
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      errorMessage,
    } = this.state
    const {
      as: Element,
      children,
      id,
      label,
      value,
      renderLabel,
    } = this.props

    const tooltipClasses = classNames(
      'tooltiptext',
      ['should-display', value && errorMessage],
    )

    return (
      <Element className="validated-form-input">
        {renderLabel && <label htmlFor={id}>{label}</label>}
        <input
          placeholder={renderLabel ? undefined : label}
          {...this.inputProps}
          onChange={this._handleChange} />
        <div className={tooltipClasses}>{this.state.errorMessage}</div>
        {children}
      </Element>
    )
  }


  get inputProps () {
    const inputProps = { ...this.props }

    delete inputProps.as
    delete inputProps.children
    delete inputProps.doubleValidate
    delete inputProps.invalidMessage
    delete inputProps.label
    delete inputProps.renderLabel
    delete inputProps.onChange
    delete inputProps.patternMessage

    if (inputProps.inputRef) {
      delete inputProps.inputRef
      inputProps.ref = this.props.inputRef
    }

    if (!inputProps.name) {
      inputProps.name = inputProps.id
    }

    return inputProps
  }


  static defaultProps = {
    as: 'fieldset',
    doubleValidate: false,
    invalidMessage: null,
    name: null,
    onChange: () => ({}),
    pattern: null,
    patternMessage: null,
    renderLabel: false,
    type: 'text',
  }

  static propTypes = {
    as: PropTypes.elementType,
    doubleValidate: PropTypes.bool,
    id: PropTypes.string.isRequired,
    invalidMessage: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    pattern: PropTypes.string,
    patternMessage: PropTypes.string,
    renderLabel: PropTypes.bool,
    type: PropTypes.string,
  }
}


export default ValidatedFormInput
