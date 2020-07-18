// Module imports
import { isError } from 'flux-standard-action'
import React from 'react'





// Component imports
import PasswordField from '~/components/PasswordField'
import { passwordPattern } from '~/data/RegExpr'
import { Link } from '~/routes'
import { connect } from '~/store'
import { validatePasswordResetToken } from '~/store/actions/authentication'





@connect
class PasswordReset extends React.Component {
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

  _handleFieldChange = (event) => {
    return this.setState({ password: event.target.value })
  }


  _handleSubmit = async (event) => {
    event.preventDefault()

    const {
      t: token,
    } = this.props.query

    const {
      password,
    } = this.state

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

  static async getInitialProps ({ query, store }) {
    const {
      t: token,
    } = query

    let validateError = true

    if (token) {
      const response = await store.dispatch(validatePasswordResetToken(token))
      validateError = isError(response)
    }

    return {
      validateError,
    }
  }

  static getPageMeta () {
    return {
      title: 'Password Reset',
    }
  }

  render () {
    const {
      validateError,
    } = this.props
    const {
      password,
      submitted,
      submitting,
    } = this.state

    return (
      <div className="page-content">
        {
            submitted && (
              <span>{'Your password has been changed! You may now login with your new credentials.'}</span>
            )
          }
        {
            (!submitted && !validateError) && (
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
                    onChange={this._handleFieldChange} />
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
            (!submitted && validateError) && (
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
            )
          }
      </div>
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

  static mapDispatchToProps = ['resetPassword']
}





export default PasswordReset
