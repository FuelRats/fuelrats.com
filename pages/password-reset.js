// Component imports
import { Link } from '../routes'
import Component from '../components/Component'
import Page from '../components/Page'
import PasswordField from '../components/PasswordField'





// Component imports
const title = 'Password Reset'





class PasswordReset extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const token = this.props.query.t
    let tokenIsValid

    if (token) {
      tokenIsValid = await this.props.validatePasswordResetToken(token)
    }

    this.setState({
      tokenIsValid,
      validating: false,
    })
  }

  constructor (props) {
    super(props)

    this._bindMethods(['onSubmit'])

    this.state = {
      password: '',
      submitted: false,
      submitting: false,
      token: props.query.t,
      tokenIsValid: false,
      validating: true,
    }
  }

  async onSubmit (event) {
    const {
      password,
      token,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    await this.props.resetPassword(password, token)

    this.setState({
      submitted: true,
      submitting: false,
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
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        <div className="page-content">
          {validating && (
            <span>Validating token...</span>
          )}

          {submitted && (
            <span>Your password has been changed! You may now login with your new credentials.</span>
          )}

          {(!submitted && !validating && tokenIsValid) && (
            <form onSubmit={this.onSubmit}>
              <fieldset>
                <label htmlFor="password">
                  New Password
                </label>

                <PasswordField
                  disabled={submitting}
                  id="password"
                  name="password"
                  onChange={event => this.setState({ password: event.target.value })}
                  pattern="^[^\s]{5,42}$"
                  placeholder="Use a strong password to keep your account secure"
                  ref={_password => this._password = _password}
                  required
                  showStrength
                  showSuggestions
                  value={password} />
              </fieldset>

              <menu type="toolbar">
                <div className="primary">
                  <button
                    disabled={submitting || !this.validate()}
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





const mapDispatchToProps = ['resetPassword', 'validatePasswordResetToken']





export default Page(PasswordReset, title, { mapDispatchToProps })
