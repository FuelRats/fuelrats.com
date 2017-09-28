// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import { actions } from '../store'
import Component from '../components/Component'
import Page from '../components/Page'
import PasswordField from '../components/PasswordField'





// Component imports
const title = 'Password Reset'





class PasswordReset extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods([
      'onSubmit',
    ])

    this.state = {
      newPassword: '',
      submitting: false,
      token: null,
    }
  }

  static async getInitialProps ({ query }) {
    let token = query.t

    if (token) {
      try{
        let response = await fetch(`/api/reset/${token}`, {
          method: 'get',
        })
        response = await response.json()

        console.log(response)

        return {
          token,
        }
      } catch (error) {
        return {}
      }
    }

    return {}
  }

  async onSubmit (event) {
    let {
      newPassword,
      token,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    await this.props.resetPassword(newPassword, token)

    this.setState({ submitting: false })
  }

  render () {
    let {
      token,
    } = this.props
    let {
      newPassword,
      submitting,
    } = this.state

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        {!!token && (
          <div className="page-content">
            <form onSubmit={this.onSubmit}>
              <fieldset>
                <label
                  htmlFor="password">
                  New Password
                </label>

                <PasswordField
                  disabled={submitting}
                  id="password"
                  name="password"
                  onChange={newPassword => this.setState({ newPassword })}
                  pattern="^[^\s]{5,42}$"
                  placeholder="Use a strong password to keep your account secure"
                  ref={_password => this._password = _password}
                  required={true}
                  showStrength={true}
                  showSuggestions={true}
                  value={newPassword} />
              </fieldset>

              <menu type="toolbar">
                <div className="primary">
                  <button
                    disabled={submitting || !this.validate()}
                    type="submit">
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>

                <div className="secondary"></div>
              </menu>
            </form>
          </div>
        )}

        {!token && (
          <div className="page-content">
            <header>
              <h3>Invalid Token</h3>
            </header>

            <p>Your token is invalid, which probably just means it expired. <Link href="/forgot-password"><a>Click here</a></Link> to try resetting your password again.</p>
          </div>
        )}
      </div>
    )
  }

  validate () {
    if (!this._password) {
      return false
    }

    if (!this._password.validity.valid) {
      return false
    }

    return true
  }
}






const mapDispatchToProps = dispatch => {
  return {
    resetPassword: bindActionCreators(actions.resetPassword, dispatch),
  }
}





export default Page(PasswordReset, title, {
  mapDispatchToProps,
})
