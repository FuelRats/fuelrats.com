// Module imports
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import zxcvbn from 'zxcvbn'





// Component imports
import Component from './Component'





export default class PasswordField extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods([
      'handleChange',
      'handleShowPasswordClick',
    ])

    this.state = {
      focused: false,
      password: '',
      passwordStrength: 0,
      passwordSuggestions: new Set(),
      passwordWarnings: new Set(),
      showPassword: false,
    }
  }

  handleChange (event) {
    const {
      maxLength,
      minLength,
      onChange,
    } = this.props
    const { value } = event.target

    this.setState((state) => {
      const newState = { ...state }
      const passwordEvaluation = zxcvbn(value)

      newState.passwordWarnings.clear()
      newState.passwordSuggestions.clear()

      if (minLength && (value.length < minLength)) {
        newState.passwordWarnings.add(`Password must be at least ${minLength} characters`)
      }

      if (maxLength && (value.length > maxLength)) {
        newState.passwordWarnings.add(`Password must be no longer than ${maxLength} characters`)
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
      onChange(event)
    }
  }

  handleShowPasswordClick () {
    this.setState((state) => ({ showPassword: !state.showPassword }))
    this._el.focus()
  }

  render () {
    const {
      focused,
      password,
      passwordStrength,
      showPassword,
    } = this.state
    const {
      disabled,
      showStrength,
      showSuggestions,
    } = this.props

    const inputProps = { ...this.props }

    delete inputProps.onChange
    delete inputProps.showStrength
    delete inputProps.showSuggestions

    return (
      <div
        className="password-group"
        data-focused={focused}>
        <div className="input-group">
          <input
            {...inputProps}
            onBlur={() => this.setState({ focused: false })}
            onChange={this.handleChange}
            onFocus={() => this.setState({ focused: true })}
            ref={(_el) => {
              this._el = _el
            }}
            type={showPassword ? 'text' : 'password'}
            value={password} />

          <button
            className={showPassword ? 'show' : 'hide'}
            disabled={disabled}
            onClick={this.handleShowPasswordClick}
            tabIndex="-1"
            type="button">
            <FontAwesomeIcon icon={showPassword ? 'eye-slash' : 'eye'} fixedWidth />
          </button>
        </div>

        {showStrength && (
          <meter
            className="password-strength-meter"
            hidden={!password}
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
