// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import { connect } from '../store'
import { Router } from '../routes'
import Dialog from './Dialog'
import ValidatedFormInput from './ValidatedFormInput'
import Switch from './Switch'




@connect
class LoginDialog extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    email: '',
    password: '',
    remember: false,
    error: false,
    validity: {
      email: false,
      password: false,
    },
  }

  emailInput = React.createRef()





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = ({ target, valid }) => this.setState(({ validity }) => {
    const {
      name,
      value,
    } = target
    const required = typeof validity[name] !== 'undefined'

    return {
      [name]: value,
      ...(required
        ? {
          validity: {
            ...validity,
            [name]: valid,
          },
        }
        : {}),
    }
  })

  _handleSwitchChange = ({ target }) => this.setState({ [target.name]: target.checked })

  _handleSubmit = async (event) => {
    event.preventDefault()

    const { status } = await this.props.login({
      email: this.state.email,
      password: this.state.password,
      remember: this.state.remember,
    })

    if (status === 'success') {
      this.props.getUser()
      this.props.onClose()
    } else {
      this.setState({
        error: true,
      })
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.emailInput.current.focus()
  }

  render () {
    const {
      email,
      error,
      password,
      remember,
    } = this.state

    return (
      <Dialog
        className="login-dialog no-pad"
        title="Login"
        onClose={this.props.onClose}>
        <form className="dialog" onSubmit={this._handleSubmit}>
          {error && !this.props.loggingIn && (
            <div className="store-errors">
              <div className="store-error">
                Invalid email or password.
              </div>
            </div>
          )}

          <ValidatedFormInput
            aria-label="Fuel rats account e-mail"
            autoComplete="username"
            className="email dark"
            disabled={this.props.loggingIn}
            id="email"
            inputRef={this.emailInput}
            label="Email"
            name="email"
            onChange={this._handleChange}
            required
            type="email"
            value={email} />

          <ValidatedFormInput
            aria-label="Fuel rats account password"
            autoComplete="current-password"
            className="password dark"
            disabled={this.props.loggingIn}
            id="password"
            label="Password"
            name="password"
            onChange={this._handleChange}
            pattern="^.{5,42}$"
            required
            type="password"
            value={password} />
          <fieldset>
            <div className="switch-form-container">
              <Switch
                aria-label="Remember me on this computer"
                disabled={this.props.loggingIn}
                id="remember"
                label="Remember me"
                name="remember"
                onChange={this._handleSwitchChange}
                checked={remember} />
            </div>
          </fieldset>

          <menu type="toolbar">
            <div className="secondary">
              <button
                className="secondary"
                onClick={() => {
                  this.props.onClose()
                  Router.push('/register')
                }}
                type="button">
                Become a Rat
              </button>
            </div>

            <div className="primary">
              <a className="button link secondary mobile-button" href="/forgot-password">Forgot password?</a>
              <button
                className="green"
                disabled={!this.isValid}
                type="submit">
                {this.props.loggingIn ? 'Submitting...' : 'Login'}
              </button>
            </div>
          </menu>
        </form>
      </Dialog>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isValid () {
    if (this.props.loggingIn) {
      return false
    }

    return !Object.values(this.state.validity).filter((value) => value !== true).length
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['login', 'getUser']

  static mapStateToProps = (state) => state.authentication





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static propTypes = {
    getUser: PropTypes.func.isRequired,
    loggingIn: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }
}





export default LoginDialog
