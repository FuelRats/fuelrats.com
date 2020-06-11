// Module imports
import { isError } from 'flux-standard-action'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import ErrorBox from '../ErrorBox'
import asModal, { ModalContent, ModalFooter } from '../Modal'
import Switch from '../Switch'
import ValidatedFormInput from '../ValidatedFormInput'
import styles from './LoginModal.module.scss'
import getFingerprint from '~/helpers/getFingerprint'
import { Router } from '~/routes'
import { connect } from '~/store'
import { login } from '~/store/actions/authentication'
import { setFlag } from '~/store/actions/flags'
import { getUserProfile } from '~/store/actions/user'
import { selectFlagByName, selectSession } from '~/store/selectors'



const VERIFY_TOKEN_LENGTH = 6


@connect
@asModal({
  className: 'login-dialog',
  title: 'Login',
})
class LoginModal extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    error: false,
    email: '',
    fingerprint: null,
    loggingIn: false,
    password: '',
    verify: '',
    remember: false,
    validity: {
      email: false,
      password: false,
    },
  }

  emailInput = React.createRef()





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = ({ target, valid }) => {
    this.setState(({ validity }) => {
      const {
        name,
        value,
      } = target
      const required = typeof validity[name] !== 'undefined'

      return {
        [name]: value,
        ...(required
          ? {
            validity: {
              ...validity,
              [name]: valid,
            },
          }
          : {}),
      }
    })
  }

  _handleSwitchChange = ({ target }) => {
    this.setState({ [target.name]: target.checked })
  }

  _handleSubmit = async (event) => {
    event.preventDefault()

    this.setState({ loggingIn: true })

    const opts = {
      email: this.state.email,
      fingerprint: this.state.fingerprint,
      password: this.state.password,
      remember: this.state.remember,
    }

    if (this.verifying) {
      opts.verify = this.state.verify
    }

    const response = await this.props.login(opts)

    if (isError(response)) {
      this.setState({
        loggingIn: false,
        error: response.payload?.errors?.[0] ?? 'unknown',
      })
      return
    }
    this.setState({ loggingIn: false })

    this.props.getUserProfile()
    this.props.onClose()
  }

  _handleRegisterClick = () => {
    this.props.onClose()
    Router.pushRoute('register')
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    this.emailInput.current.focus()

    const fingerprint = await getFingerprint()
    this.setState({ fingerprint })
  }

  render () {
    const {
      userAgent,
    } = this.props

    const {
      email,
      error,
      loggingIn,
      verify,
      password,
      remember,
    } = this.state

    const isFirefox = Boolean(userAgent.match(/firefox/giu))

    return (
      <ModalContent as="form" className="dialog no-pad" onSubmit={this._handleSubmit}>
        {
          error && !loggingIn && (
            <ErrorBox className={styles.errorBox}>
              {
                (() => {
                  switch (error.status) {
                    case 'verification_required':
                      if (error.source?.pointer === 'verify') {
                        return 'That verification token was incorrect.\nPlease try again.\n'
                      }
                      return 'It appears you\'re logging in from a new device.\nA verification code has been sent to your email.'
                    case 'unauthorized':
                      return 'Invalid Username or Password'
                    default:
                      return 'Whoops. Something went wrong!'
                  }
                })()
              }
            </ErrorBox>
          )
        }

        {
          this.verifying === true && (
            <ValidatedFormInput
              required
              aria-label="Verification code from email"
              className="dark"
              disabled={loggingIn}
              id="verify"
              label="Verification Code"
              maxLength={6}
              name="verify"
              pattern="^[A-Z0-9]{6}$"
              type="text"
              value={verify}
              onChange={this._handleChange} />
          )
        }

        {
          this.verifying === false && (
            <>
              <ValidatedFormInput
                required
                aria-label="Fuel rats account e-mail"
                autoComplete="username"
                className="email dark"
                disabled={loggingIn}
                doubleValidate={isFirefox}
                id="email"
                inputRef={this.emailInput}
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={this._handleChange} />

              <ValidatedFormInput
                required
                aria-label="Fuel rats account password"
                autoComplete="current-password"
                className="password dark"
                disabled={loggingIn}
                doubleValidate={isFirefox}
                id="password"
                label="Password"
                name="password"
                pattern="^.{5,42}$"
                type="password"
                value={password}
                onChange={this._handleChange} />

              <fieldset>
                <div className="switch-form-container">
                  <Switch
                    aria-label="Remember me on this computer"
                    checked={remember}
                    disabled={loggingIn}
                    id="remember"
                    label="Remember me"
                    name="remember"
                    onChange={this._handleSwitchChange} />
                </div>
              </fieldset>
            </>
          )
        }

        <ModalFooter className={styles.footer}>
          <div className={styles.secondary}>
            <button
              className={[styles.button, 'secondary']}
              type="button"
              onClick={this._handleRegisterClick}>
              {'Become a Rat'}
            </button>
          </div>

          <div className={styles.primary}>
            <a className={styles.linkButton} href="/forgot-password">
              {'Forgot password?'}
            </a>
            <button
              className={[styles.button, 'green']}
              disabled={!this.isValid}
              type="submit">
              {loggingIn ? 'Submitting...' : 'Login'}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isValid () {
    if (this.state.loggingIn) {
      return false
    }

    if (!this.state.fingerprint) {
      return false
    }

    if (this.verifying) {
      return this.state.verify.length === VERIFY_TOKEN_LENGTH
    }

    return !Object.values(this.state.validity).filter((value) => {
      return value !== true
    }).length
  }

  get verifying () {
    return this.state.error?.status === 'verification_required'
  }



  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    userAgent: PropTypes.string.isRequired,
  }


  static mapDispatchToProps = {
    getUserProfile,
    login,
    onClose: () => {
      return setFlag('showLoginDialog', false)
    },
  }

  static mapStateToProps = (state) => {
    return {
      isOpen: selectFlagByName(state, { name: 'showLoginDialog' }),
      userAgent: selectSession(state).userAgent,
    }
  }
}





export default LoginModal
