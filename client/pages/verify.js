/* eslint-disable no-console */
// Module imports
import React from 'react'
// import PropTypes from 'prop-types'

// Component imports
import { actions, connect, actionStatus } from '../store'
import { Router, Link } from '../routes'
import PageWrapper from '../components/PageWrapper'
import httpStatus from '../helpers/httpStatus'
import PasswordField from '../components/PasswordField'
import { passwordPattern } from '../data/RegExpr'


// Component Constants

@connect
class Verify extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    password: '',
    submitted: false,
    submitting: false,
    validating: false,
  }

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

    const resetResponse = await this.props.resetPassword({
      password,
      token,
    })

    if (resetResponse.status === actionStatus.SUCCESS) {
      this.setState({
        submitted: true,
        submitting: false,
      })
      Router.pushRoute('home', { authenticate: true })
    }
  }
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ query, store, res }) {
    // eslint-disable-next-line id-length
    const { type, t: token } = query
    let destination = null
    let response = null

    switch (type) {
      case 'reset':
        console.log('Reset Redirect', token)
        response = await actions.verifyResetToken(token)(store.dispatch)
        if (response.status === actionStatus.SUCCESS) {
          destination = null
        }
        break
      case 'email':
        console.log('Verifying Email')
        response = await actions.verifyEmailToken(token)(store.dispatch)
        if (response.status === actionStatus.SUCCESS) {
          destination = '/profile'
        }
        break
      case 'session':
        console.log('Session was recieved')
        response = await actions.verifySessionToken(token)(store.dispatch)
        if (response.status === actionStatus.SUCCESS) {
          destination = '/?authenticate=true'
        }
        break
      default:
        destination = '/'
        break
    }
    if (destination === null) {
      return response
    }
    if (res) {
      res.writeHead(httpStatus.FOUND, {
        Location: `${destination}`,
      })
      res.end()
      res.finished = true
    } else {
      Router.replace(`${destination}`)
    }

    return { response }
  }

  render () {
    const {
      password,
      submitted,
      submitting,
      validating,
    } = this.state

    const tokenIsValid = this.props.response.status
    const { type } = this.props.query
    return (
      <PageWrapper title="Verify">
        <div className="page-content">

          {submitted && (
            <span>Your password has been changed! You may now login with your new credentials.</span>
          )}

          {(type !== 'reset') && (
            <span>An error as occurred, please try again</span>
          )}

          {(!submitted && !validating && tokenIsValid && type === 'reset') && (
            <form onSubmit={this._handleSubmit}>
              <fieldset>
                <label htmlFor="password">
                  New Password
                </label>

                <PasswordField
                  disabled={submitting}
                  id="password"
                  name="password"
                  onChange={(event) => this.setState({ password: event.target.value })}
                  pattern={passwordPattern}
                  placeholder="Use a strong password to keep your account secure"
                  ref={(_password) => {
                    this._password = _password
                  }}
                  required
                  showStrength
                  showSuggestions
                  value={password} />
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
          )}

          {(!submitted && !validating && !tokenIsValid) && (
            <div>
              <header>
                <h3>Invalid Token</h3>
              </header>

              <p>Your token is invalid, which probably just means it expired. <Link href="/forgot-password"><a>Click here</a></Link> to try resetting your password again.</p>
            </div>
          )}
        </div>
      </PageWrapper>
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

  static mapStateToProps = () => ({})

  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {}

  static propTypes = {}
}

export default Verify
