import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import zxcvbn from 'zxcvbn'





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

  _passwordRef = React.createRef()





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

    if (this._passwordRef.current) {
      this.validity = this._passwordRef.current.validity
    }

    if (onChange) {
      onChange({
        target,
        validity: this.validity,
      })
    }
  }

  _handleShowPasswordClick = () => {
    this.setState((state) => {
      return { showPassword: !state.showPassword }
    })
    this._passwordRef.current.focus()
  }

  _handleInputBlur = () => {
    return this.setState({ focused: false })
  }

  _handleInputFocus = () => {
    return this.setState({ focused: true })
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

    const inputProps = { ...this.props }

    delete inputProps.onChange
    delete inputProps.showStrength
    delete inputProps.showSuggestions

    return (
      <div
        className={['password-group', { 'show-strength': showStrength, 'show-suggestions': showSuggestions }, className]}
        data-focused={focused}>
        <div className="input-group">
          <input
            {...inputProps}
            ref={this._passwordRef}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onBlur={this._handleInputBlur}
            onChange={this._handleChange}
            onFocus={this._handleInputFocus} />

          <button
            className={showPassword ? 'show' : 'hide'}
            disabled={disabled}
            tabIndex="-1"
            type="button"
            onClick={this._handleShowPasswordClick}>
            <FontAwesomeIcon fixedWidth icon={showPassword ? 'eye-slash' : 'eye'} />
          </button>
        </div>

        {
          showStrength && (
            <meter
              className="password-strength-meter"
              high="3"
              low="2"
              max="4"
              optimum="4"
              value={passwordStrength} />
          )
        }

        {showSuggestions && this.renderWarnings()}
      </div>
    )
  }

  static renderSuggestion (suggestion, index) {
    return (
      <li
        key={index}
        className="suggestion">
        <FontAwesomeIcon fixedWidth icon="info-circle" />
        {suggestion}
      </li>
    )
  }

  static renderWarning (warning, index) {
    return (
      <li
        key={index}
        className="warning">
        <FontAwesomeIcon fixedWidth icon="exclamation-triangle" />
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
