// Module imports
import React from 'react'





// Component imports
import { PageWrapper } from '../components/AppLayout'
import PasswordField from '../components/PasswordField'
import { passwordPattern } from '../data/RegExpr'
import { Link } from '../routes'
import { connect } from '../store'





@connect
class PasswordReset extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    password: '',
    submitted: false,
    submitting: false,
    token: this.props.query.t,
    tokenIsValid: false,
    validating: true,
  }

  _passwordRef = React.createRef()





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleFieldChange = (event) => this.setState({ password: event.target.value })


  _handleSubmit = async (event) => {
    const {
      password,
      token,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    await this.props.resetPassword({
      password,
      token,
    })

    this.setState({
      submitted: true,
      submitting: false,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const token = this.props.query.t
    let tokenIsValid = false

    if (token) {
      const { status } = await this.props.validatePasswordResetToken(token)
      tokenIsValid = status === 'success'
    }

    this.setState({
      tokenIsValid,
      validating: false,
    })
  }

  render () {
    const {
      password,
      submitted,
      submitting,
      tokenIsValid,
      validating,
    } = this.state

    return (
      <PageWrapper title="Password Reset">
        <div className="page-content">
          {validating && (
            <span>{'Validating token...'}</span>
          )}

          {submitted && (
            <span>{'Your password has been changed! You may now login with your new credentials.'}</span>
          )}

          {(!submitted && !validating && tokenIsValid) && (
            <form onSubmit={this._handleSubmit}>
              <fieldset>
                <label htmlFor="password">
                  {'New Password'}
                </label>

                <PasswordField
                  disabled={submitting}
                  id="password"
                  name="password"
                  onChange={this._handleFieldChange}
                  pattern={passwordPattern}
                  placeholder="Use a strong password to keep your account secure"
                  ref={this._passwordRef}
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
                <h3>{'Invalid Token'}</h3>
              </header>

              <p>
                {'Your token is invalid, which probably just means it expired. '}
                <Link route="auth forgot-pass"><a>{'Click here'}</a></Link>
                {' to try resetting your password again.'}
              </p>
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
    if (!this._passwordRef.current) {
      return false
    }

    if (!this._passwordRef.current.validity.valid) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['resetPassword', 'validatePasswordResetToken']
}





export default PasswordReset
