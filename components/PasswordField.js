// Module imports
import React from 'react'
import zxcvbn from 'zxcvbn'





// Component imports
import Component from './Component'





export default class extends Component {

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
      passwordSuggestions: new Set,
      passwordWarnings: new Set,
      showPassword: false,
    }
  }

  handleChange (event) {
    let {
      maxLength,
      minLength,
      onChange,
    } = this.props
    let {
      value,
    } = event.target
    let {
      password,
    } = this.state
    let newState = Object.assign({}, this.state)

    let passwordEvaluation = zxcvbn(value)

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

    for (let suggestion of passwordEvaluation.feedback.suggestions) {
      newState.passwordSuggestions.add(suggestion)
    }

    this.setState(newState)

    if (this._el) {
      this.validity = this._el.validity
    }

    if (onChange) {
      onChange(event)
    }
  }

  handleShowPasswordClick () {
    let {
      showPassword,
    } = this.state

    this.setState({ showPassword: !showPassword })
    this._el.focus()
  }

  render () {
    let {
      focused,
      password,
      passwordStrength,
      passwordSuggestions,
      passwordWarnings,
      showPassword,
    } = this.state
    let {
      onChange,
      showStrength,
      showSuggestions,
    } = this.props

    let inputProps = Object.assign({}, this.props)

    delete inputProps.onChange
    delete inputProps.showStrength
    delete inputProps.showSuggestions

    return(
      <div
        className="password-group"
        data-focused={focused}>
        <div className="input-group">
          <input
            {...inputProps}
            onBlur={() => this.setState({ focused: false })}
            onChange={this.handleChange}
            onFocus={() => this.setState({ focused: true })}
            ref={_el => this._el = _el}
            type={showPassword ? 'text' : 'password'}
            value={password} />

          <button
            className={showPassword ? 'show' : 'hide'}
            onClick={this.handleShowPasswordClick}
            tabIndex="-1"
            type="button">
            {!showPassword && (
              <i className="fa fa-eye" />
            )}
            {showPassword && (
              <i className="fa fa-eye-slash" />
            )}
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

  renderSuggestion (suggestion, index) {
    return (
      <li
        className="suggestion"
        key={index}>
        <i className="fa fa-fw fa-info-circle" />
        {suggestion}
      </li>
    )
  }

  renderWarning (warning, index) {
    return (
      <li
        className="warning"
        key={index}>
        <i className="fa fa-fw fa-warning" />
        {warning}
      </li>
    )
  }

  renderWarnings () {
    let {
      passwordSuggestions,
      passwordWarnings,
    } = this.state

    if (passwordWarnings) {
      return (
        <ul className="info">
          {[...passwordWarnings].map(this.renderWarning)}
          {[...passwordSuggestions].map(this.renderSuggestion)}
        </ul>
      )
    }

    return null
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get validity () {
    return this._validity || (this._validity = {
      valid: false,
    })
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  set validity (value) {
    this._validity = value
  }
}
