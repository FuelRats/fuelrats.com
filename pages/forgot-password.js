// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../store'
import Component from '../components/Component'
import Page from '../components/Page'





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
      email: '',
      submitted: false,
      submitting: false,
    }
  }

  static async getInitialProps ({ asPath, isServer, query }) {
    return Object.assign({
      path: asPath,
      query,
    }, query)
  }

  async onSubmit (event) {
    event.preventDefault()

    let {
      email,
    } = this.state

    this.setState({ submitting: true })

    await this.props.sendPasswordResetEmail(email)

    this.setState({
      submitted: true,
      submitting: false,
    })
  }

  render () {
    let {
      path,
      query,
    } = this.state
    let {
      email,
      submitted,
      submitting,
    } = this.state

    return (
      <Page
        path={path}
        query={query}
        title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">
          {!submitted && (
            <form onSubmit={this.onSubmit}>
              <fieldset>
                <label htmlFor="email">Enter the email address associated with your account <small>We'll send you an email with a link to reset your password.</small></label>

                <input
                  id="email"
                  onChange={event => this.setState({ email: event.target.value })}
                  name="email"
                  ref={_emailEl => this._emailEl = _emailEl}
                  type="email"
                  value={email} />
              </fieldset>

              <menu type="toolbar">
                <div className="primary">
                  <button
                    disabled={!email || submitting || !this.validate()}
                    type="submit">
                    {submitting ? 'Submitting...' : 'Send Email'}
                  </button>
                </div>

                <div className="secondary"></div>
              </menu>
            </form>
          )}

          {submitted && (
            <div>
              <h3>Thanks!</h3>

              <p>If there's a Fuel Rats account associated with that address, you should receive an email shortly with the final steps for resetting your password. If you don't receive an email, please contact <a href="mailto:support@fuelrats.com">support@fuelrats.com</a>.</p>
            </div>
          )}
        </div>
      </Page>
    )
  }

  validate () {
    if (!this._emailEl) {
      return false
    }

    if (!this._emailEl.validity.valid) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Forgot Password'
  }
}






const mapDispatchToProps = dispatch => {
  return {
    sendPasswordResetEmail: bindActionCreators(actions.sendPasswordResetEmail, dispatch),
  }
}





export default withRedux(initStore, null, mapDispatchToProps)(PasswordReset)
