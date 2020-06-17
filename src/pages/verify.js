// Module imports
import { isError } from 'flux-standard-action'
import React from 'react'





// Component imports
import PasswordField from '~/components/PasswordField'
import { passwordPattern } from '~/data/RegExpr'
import { pageRedirect } from '~/helpers/gIPTools'
import { Router, Link } from '~/routes'
import { actions, connect } from '~/store'




@connect
class Verify extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    password: '',
    submitted: false,
    submitting: false,
  }

  _passwordRef = React.createRef()



  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubmit = async (event) => {
    const {
      password,
      token,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    const response = await this.props.resetPassword({
      password,
      token,
    })

    if (isError(response)) {
      this.setState({
        submitted: true,
        submitting: false,
      })
      Router.pushRoute('home', { authenticate: true })
    }
  }

  _handlePasswordInputChange = (event) => {
    this.setState({ password: event.target.value })
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps (ctx) {
    const { query, store } = ctx
    const { type, t: token } = query
    let destination = null
    let response = null

    switch (type) {
      case 'reset':
        response = await store.dispatch(actions.verifyResetToken(token))
        if (!isError(response)) {
          destination = null
        }
        break
      case 'email':
        response = await store.dispatch(actions.verifyEmailToken(token))
        if (!isError(response)) {
          destination = '/profile'
        }
        break
      default:
        destination = '/'
        break
    }

    if (destination) {
      pageRedirect(ctx, destination)
    }

    return {
      tokenIsValid: response.status,
    }
  }

  render () {
    const {
      password,
      submitted,
      submitting,
    } = this.state

    const { tokenIsValid } = this.props
    const { type } = this.props.query
    return (
      <div className="page-content">

        {
          submitted && (
            <span>{'Your password has been changed! You may now login with your new credentials.'}</span>
          )
        }

        {
          (type !== 'reset') && (
            <span>{'An error as occurred, please try again'}</span>
          )
        }

        {
          (!submitted && tokenIsValid && type === 'reset') && (
            <form onSubmit={this._handleSubmit}>
              <fieldset>
                <label htmlFor="password">
                  {'New Password'}
                </label>

                <PasswordField
                  ref={this._passwordRef}
                  required
                  showStrength
                  showSuggestions
                  disabled={submitting}
                  id="password"
                  name="password"
                  pattern={passwordPattern}
                  placeholder="Use a strong password to keep your account secure"
                  value={password}
                  onChange={this._handlePasswordInputChange} />
              </fieldset>

              <menu type="toolbar">
                <div className="primary">
                  <button
                    disabled={submitting || !this.canSubmit}
                    type="submit">
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>

                <div className="secondary" />
              </menu>
            </form>
          )
        }

        {
          (!submitted && !tokenIsValid) && (
            <div>
              <header>
                <h3>{'Invalid Token'}</h3>
              </header>

              <p>
                {'Your token is invalid, which probably just means it expired. '}
                <Link href="/forgot-password">
                  <a>
                    {'Click here'}
                  </a>
                </Link>
                {' to try resetting your password again.'}
              </p>
            </div>
          )
        }
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get canSubmit () {
    if (!this._password) {
      return false
    }

    if (!this._password.validity.valid) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['resetPassword', 'validatePasswordResetToken']
}





export default Verify
