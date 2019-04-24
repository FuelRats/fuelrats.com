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

  _handleChange = ({ target }) => {
    const {
      invalidMessage,
      label,
      onChange,
      pattern,
      patternMessage,
      required,
    } = this.props
    const {
      value,
    } = target

    let valid = true
    let message = null

    if (!target.checkValidity()) {
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

    onChange({
      target,
      valid,
      message,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      errorMessage,
    } = this.state
    const {
      id,
      label,
      value,
      renderLabel,
    } = this.props

    const tooltipClasses = classNames(
      'tooltiptext',
      ['should-display', value && errorMessage]
    )

    return (
      <fieldset className="validated-form-input">
        {renderLabel && <label htmlFor={id}>{label}</label>}
        <input
          placeholder={renderLabel ? undefined : label}
          {...this.inputProps}
          onChange={this._handleChange} />
        <div className={tooltipClasses}>{this.state.errorMessage}</div>
      </fieldset>
    )
  }


  get inputProps () {
    const inputProps = { ...this.props }

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
    invalidMessage: null,
    name: null,
    onChange: () => ({}),
    pattern: null,
    patternMessage: null,
    renderLabel: false,
    type: 'text',
  }

  static propTypes = {
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
