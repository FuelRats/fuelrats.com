// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Component imports
import { actions } from '../store'
import { Router } from '../routes'
import Component from './Component'
import Dialog from './Dialog'



class LoginDialog extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    email: '',
    password: '',
    error: false,
  }

  emailInput = React.createRef()





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.emailInput.current.focus()
  }

  onSubmit = async event => {
    event.preventDefault()

    const { status } = await this.props.login(this.state.email, this.state.password)
    this.props.getUser()

    if (status === 'success') {
      this.props.onClose()
    } else {
      this.setState({
        error: true,
      })
    }
  }

  render () {
    const {
      email,
      error,
      password,
    } = this.state

    return (
      <Dialog
        className="login-dialog"
        title="Login"
        onClose={this.props.onClose}>
        <form onSubmit={this.onSubmit}>
          {error && !this.props.loggingIn && (
            <div className="store-errors">
              <div className="store-error">
                Invalid email or password.
              </div>
            </div>
          )}

          <input
            className="email"
            disabled={this.props.loggingIn}
            id="email"
            name="email"
            onInput={event => this.setState({ email: event.target.value })}
            placeholder="Email"
            ref={this.emailInput}
            required
            type="email" />

          <input
            className="password"
            disabled={this.props.loggingIn}
            id="password"
            name="password"
            onInput={event => this.setState({ password: event.target.value })}
            placeholder="Password"
            required
            type="password" />

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
                disabled={!email || !password || this.props.loggingIn}
                type="submit">
                {this.props.loggingIn ? 'Submitting...' : 'Login'}
              </button>
            </div>
          </menu>
        </form>
      </Dialog>
    )
  }
}





const mapDispatchToProps = dispatch => bindActionCreators({
  login: actions.login,
  getUser: actions.getUser,
}, dispatch)

const mapStateToProps = state => ({ ...state.authentication })





export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog)
