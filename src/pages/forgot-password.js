// Module imports
import { isError } from 'flux-standard-action'
import React from 'react'





// Component imports
import { connect } from '~/store'





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

  _emailRef = React.createRef()





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleInputChange = (event) => {
    this.setState({ email: event.target.value })
  }


  _handleSubmit = async (event) => {
    event.preventDefault()

    const { email } = this.state

    this.setState({
      submitting: true,
      error: false,
    })

    const response = await this.props.sendPasswordResetEmail(email)

    if (isError(response)) {
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

  static getPageMeta () {
    return {
      title: 'Forgot Password',
    }
  }

  render () {
    const {
      email,
      submitted,
      submitting,
      error,
    } = this.state

    return (
      <div className="page-content">
        {
          error && (
            <div className="store-errors">
              <div className="store-error">
                <span className="detail">{'Error submitting password reset request.'}</span>
              </div>
            </div>
          )
        }

        {
          !submitted && (
            <form onSubmit={this._handleSubmit}>
              <fieldset>
                <label htmlFor="email">
                  {'Enter the email address associated with your account. '}
                  <small>{"We'll send you an email with a link to reset your password."}</small>
                </label>

                <input
                  ref={this._emailRef}
                  aria-label="user email"
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={this._handleInputChange} />
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
          )
        }

        {
          submitted && (
            <div>
              <h3>{'Thanks!'}</h3>

              <p>
                {"If there's a Fuel Rats account associated with that address, you should receive an email shortly with the final steps for resetting your password."}
                {"If you don't receive an email, please contact "}<a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>{'.'}
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
    if (!this._emailRef.current) {
      return false
    }

    if (!this._emailRef.current.validity.valid) {
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
