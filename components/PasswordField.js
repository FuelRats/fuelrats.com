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
    ])

    this.state = {
      password: '',
      passwordStrength: 0,
      passwordSuggestions: null,
      passwordWarning: null,
      showPassword: false,
    }
  }

  handleChange (event) {
    let {
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

    newState.password = value
    newState.passwordStrength = passwordEvaluation.score
    newState.passwordSuggestions = passwordEvaluation.feedback.suggestions
    newState.passwordWarning = passwordEvaluation.feedback.warning

    this.setState(newState)

    if (this._el) {
      this.validity = this._el.validity
    }

    if (onChange) {
      onChange(event.target.value)
    }
  }

  render () {
    let {
      password,
      passwordStrength,
      passwordSuggestions,
      passwordWarning,
      showPassword,
    } = this.state
    let {
      onChange,
      showStrength,
    } = this.props

    let inputProps = Object.assign({}, this.props)

    delete inputProps.onChange
    delete inputProps.showStrength

    return(
      <div className="password-group">
        <div className="input-group">
          <input
            {...inputProps}
            name="password"
            onChange={this.handleChange}
            ref={_el => this._el = _el}
            type={showPassword ? 'text' : 'password'}
            value={password} />

          <button
            className={showPassword ? 'show' : 'hide'}
            onClick={() => this.setState({ showPassword: !showPassword })}
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
            data-warning={passwordWarning}
            data-suggestions={passwordSuggestions}
            hidden={!password}
            high="3"
            low="2"
            max="4"
            optimum="4"
            value={passwordStrength} />
        )}
      </div>
    )
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
