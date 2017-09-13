// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'





// Module imports
import { actions } from '../store'
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
    }
  }

  onSubmit (event) {
    event.preventDefault()

    this.props.login(this.state.email, this.state.password)
  }

  render () {
    return (
      <form onSubmit={this.onSubmit}>
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
              Register
            </button>
          </div>

          <div className="primary">
            <a className="button link" href="/forgot-password">Forgot password?</a>
            <button
              disabled={!this.state.email || !this.state.password || this.props.loggingIn}
              type="submit">
              {this.props.loggingIn ? 'Submitting...' : 'Login'}
            </button>
          </div>
        </menu>
      </form>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    hideDialog: bindActionCreators(actions.hideDialog, dispatch),
    login: bindActionCreators(actions.login, dispatch),
  }
}

const mapStateToProps = state => {
  return state.authentication || {}
}





export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog)
