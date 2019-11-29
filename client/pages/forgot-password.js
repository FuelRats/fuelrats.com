// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import { PageWrapper } from '../components/AppLayout'





@connect
class ForgotPassword extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    email: '',
    submitted: false,
    submitting: false,
    error: null,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubmit = async (event) => {
    event.preventDefault()

    const { email } = this.state

    this.setState({
      submitting: true,
      error: false,
    })

    const { status } = await this.props.sendPasswordResetEmail(email)

    if (status === 'error') {
      this.setState({
        submitting: false,
        error: true,
      })
    } else {
      this.setState({
        submitted: true,
        submitting: false,
      })
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      email,
      submitted,
      submitting,
      error,
    } = this.state

    return (
      <PageWrapper title="Forgot Password">
        <div className="page-content">
          {error && (
            <div className="store-errors">
              <div className="store-error">
                Error submitting password reset request.
              </div>
            </div>
          )}

          {!submitted && (
            <form onSubmit={this._handleSubmit}>
              <fieldset>
                <label htmlFor="email">Enter the email address associated with your account <small>We'll send you an email with a link to reset your password.</small></label>

                <input
                  aria-label="user email"
                  id="email"
                  onChange={(event) => this.setState({ email: event.target.value })}
                  name="email"
                  ref={(_emailEl) => {
                    this._emailEl = _emailEl
                  }}
                  type="email"
                  value={email} />
              </fieldset>

              <menu type="toolbar">
                <div className="primary">
                  <button
                    disabled={!email || submitting || !this.canSubmit}
                    type="submit">
                    {submitting ? 'Submitting...' : 'Send Email'}
                  </button>
                </div>

                <div className="secondary" />
              </menu>
            </form>
          )}

          {submitted && (
            <div>
              <h3>Thanks!</h3>

              <p>
                If there's a Fuel Rats account associated with that address, you should receive an email shortly with the final steps for resetting your password.
                If you don't receive an email, please contact <a href="mailto:support@fuelrats.com">support@fuelrats.com</a>.
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
    if (!this._emailEl) {
      return false
    }

    if (!this._emailEl.validity.valid) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['sendPasswordResetEmail']
}





export default ForgotPassword
