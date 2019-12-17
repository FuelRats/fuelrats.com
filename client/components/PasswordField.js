// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import zxcvbn from 'zxcvbn'





// Component imports
import classNames from '../helpers/classNames'




export default class PasswordField extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    focused: false,
    password: '',
    passwordStrength: 0,
    passwordSuggestions: new Set(),
    passwordWarnings: new Set(),
    showPassword: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    const {
      maxLength,
      minLength,
      onChange,
    } = this.props
    const { value } = target

    this.setState((state) => {
      const newState = { ...state }
      const passwordEvaluation = zxcvbn(value)

      newState.passwordWarnings.clear()
      newState.passwordSuggestions.clear()

      if (minLength && (value.length < minLength)) {
        newState.passwordWarnings.add(`Password must be at least ${minLength} characters.`)
      }

      if (maxLength && (value.length > maxLength)) {
        newState.passwordWarnings.add(`Password must be no longer than ${maxLength} characters.`)
      }

      if (passwordEvaluation.feedback.warning) {
        newState.passwordWarnings.add(passwordEvaluation.feedback.warning)
      }

      newState.password = value
      newState.passwordStrength = passwordEvaluation.score

      passwordEvaluation.feedback.suggestions.forEach((suggestion) => {
        newState.passwordSuggestions.add(suggestion)
      })

      return newState
    })

    if (this._el) {
      this.validity = this._el.validity
    }

    if (onChange) {
      onChange({
        target,
        validity: this.validity,
      })
    }
  }

  _handleShowPasswordClick = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }))
    this._el.focus()
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      focused,
      password,
      passwordStrength,
      showPassword,
    } = this.state
    const {
      disabled,
      className,
      showStrength,
      showSuggestions,
    } = this.props

    const classes = classNames(
      'password-group',
      ['show-strength', showStrength],
      ['show-suggestions', showSuggestions],
      className,
    )

    const inputProps = { ...this.props }

    delete inputProps.onChange
    delete inputProps.showStrength
    delete inputProps.showSuggestions

    return (
      <div
        className={classes}
        data-focused={focused}>
        <div className="input-group">
          <input
            {...inputProps}
            onBlur={() => this.setState({ focused: false })}
            onChange={this._handleChange}
            onFocus={() => this.setState({ focused: true })}
            ref={(_el) => {
              this._el = _el
            }}
            type={showPassword ? 'text' : 'password'}
            value={password} />

          <button
            className={showPassword ? 'show' : 'hide'}
            disabled={disabled}
            onClick={this._handleShowPasswordClick}
            tabIndex="-1"
            type="button">
            <FontAwesomeIcon icon={showPassword ? 'eye-slash' : 'eye'} fixedWidth />
          </button>
        </div>

        {showStrength && (
          <meter
            className="password-strength-meter"
            high="3"
            low="2"
            max="4"
            optimum="4"
            value={passwordStrength} />
        )}

        {showSuggestions && this.renderWarnings()}
      </div>
    )
  }

  static renderSuggestion (suggestion, index) {
    return (
      <li
        className="suggestion"
        key={index}>
        <FontAwesomeIcon icon="info-circle" fixedWidth />
        {suggestion}
      </li>
    )
  }

  static renderWarning (warning, index) {
    return (
      <li
        className="warning"
        key={index}>
        <FontAwesomeIcon icon="exclamation-triangle" fixedWidth />
        {warning}
      </li>
    )
  }

  renderWarnings () {
    const {
      passwordSuggestions,
      passwordWarnings,
    } = this.state

    if (passwordWarnings) {
      return (
        <ul className="info">
          {[...passwordWarnings].map(PasswordField.renderWarning)}
          {[...passwordSuggestions].map(PasswordField.renderSuggestion)}
        </ul>
      )
    }

    return null
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get validity () {
    if (!this._validity) {
      this._validity = {
        valid: false,
      }
    }

    return this._validity
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  set validity (value) {
    this._validity = value
  }
}
