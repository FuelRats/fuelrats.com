import React from 'react'
import PropTypes from 'prop-types'





class ValidatedFormInput extends React.Component {
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
    let message

    if (required && value === '') {
      valid = false
      message = `${label} is Required`
    }

    if (pattern && !value.match(pattern)) {
      valid = false
      message = patternMessage
    }

    if (!target.checkValidity()) {
      valid = false
      message = invalidMessage || `${label} is invalid`
    }

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
      id,
      label,
      renderLabel,
    } = this.props
    return (
      <fieldset>
        {renderLabel && <label htmlFor={id}>{label}</label>}
        <input
          placeholder={!renderLabel ? label : undefined}
          {...this.inputProps}
          onChange={this._handleChange} />
      </fieldset>
    )
  }


  get inputProps () {
    const inputProps = { ...this.props }

    delete inputProps.defaultProps
    delete inputProps.invalidMessage
    delete inputProps.label
    delete inputProps.renderLabel
    delete inputProps.onChange
    delete inputProps.patternMessage

    if (!inputProps.name) {
      inputProps.name = inputProps.id
    }

    return inputProps
  }


  static defaultProps = {
    invalidMessage: null,
    name: null,
    type: 'text',
    pattern: null,
    patternMessage: null,
    renderLabel: false,
    onChange: () => ({}),
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
