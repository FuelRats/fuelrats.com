// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Component imports
import { actions } from '../store'
import { Router } from '../routes'
import ApiErrorDisplay from './ApiErrorDisplay'
import Component from './Component'




class LoginDialog extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.emailInput.focus()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.loggedIn) {
      this.props.hideDialog()
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods(['onSubmit'])

    this.state = {
      email: '',
      password: '',
      error: null,
    }
  }

  async onSubmit (event) {
    event.preventDefault()

    const error = await this.props.login(this.state.email, this.state.password)

    if (error) {
      this.setState({
        error,
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
      <form onSubmit={this.onSubmit}>
        {error && !this.props.loggingIn && (
          <ApiErrorDisplay
            error={error}
            messages={[
              [422, 'Invalid login. Please try again.'],
            ]} />
        )}

        <input
          className="email"
          disabled={this.props.loggingIn}
          id="email"
          name="email"
          onInput={event => this.setState({ email: event.target.value })}
          placeholder="Email"
          ref={emailInput => this.emailInput = emailInput}
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
                this.props.hideDialog()
                Router.push('/register')
              }}
              type="button">
              Become a Rat
            </button>
          </div>

          <div className="primary">
            <a className="button link" href="/forgot-password">Forgot password?</a>
            <button
              disabled={!email || !password || this.props.loggingIn}
              type="submit">
              {this.props.loggingIn ? 'Submitting...' : 'Login'}
            </button>
          </div>
        </menu>
      </form>
    )
  }
}





const mapDispatchToProps = dispatch => ({
  hideDialog: bindActionCreators(actions.hideDialog, dispatch),
  login: bindActionCreators(actions.login, dispatch),
})

const mapStateToProps = state => ({ ...state.authentication })





export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog)
