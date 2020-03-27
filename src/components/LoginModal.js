// Module imports
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'





// Component imports
import { Router } from '../routes'
import { connect } from '../store'
import { selectFlagByName, selectSession } from '../store/selectors'
import asModal, { ModalContent, ModalFooter } from './Modal'
import Switch from './Switch'
import ValidatedFormInput from './ValidatedFormInput'





@asModal({
  className: 'login-dialog',
  title: 'Login',
})
class LoginModal extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    email: '',
    loggingIn: false,
    password: '',
    remember: false,
    error: false,
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

    const { status } = await this.props.login({
      email: this.state.email,
      password: this.state.password,
      remember: this.state.remember,
    })

    if (status === 'success') {
      this.props.getUserProfile()
      this.props.onClose()
      this.setState({ loggingIn: false })
    } else {
      this.setState({
        loggingIn: false,
        error: true,
      })
    }
  }

  _handleRegisterClick = () => {
    this.props.onClose()
    Router.pushRoute('register')
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.emailInput.current.focus()
  }

  render () {
    const {
      userAgent,
    } = this.props

    const {
      email,
      error,
      loggingIn,
      password,
      remember,
    } = this.state

    const isFirefox = Boolean(userAgent.match(/firefox/giu))

    return (
      <ModalContent as="form" className="dialog no-pad" onSubmit={this._handleSubmit}>
        {
          error && !loggingIn && (
            <div className="store-errors">
              <div className="store-error">
                {'Invalid email or password.'}
              </div>
            </div>
          )
        }

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
        <ModalFooter>
          <div className="secondary">
            <button
              className="secondary"
              type="button"
              onClick={this._handleRegisterClick}>
              {'Become a Rat'}
            </button>
          </div>

          <div className="primary">
            <a className="button link secondary mobile-button" href="/forgot-password">{'Forgot password?'}</a>
            <button
              className="green"
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

    return !Object.values(this.state.validity).filter((value) => {
      return value !== true
    }).length
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
}





function ConnectedLoginModal ({ setFlag, showLoginModal, ...modalProps }) {
  const handleClose = useMemo(() => {
    setFlag('showLoginDialog', false)
  }, [setFlag])

  return (
    <LoginModal
      isOpen={showLoginModal}
      onClose={handleClose}
      {...modalProps} />
  )
}

ConnectedLoginModal.mapDispatchToProps = [
  'getUserProfile',
  'login',
  'setFlag',
]

ConnectedLoginModal.mapStateToProps = (state) => {
  return {
    showLoginModal: selectFlagByName(state, { name: 'showLoginDialog' }),
    userAgent: selectSession(state).userAgent,
  }
}





export default connect(ConnectedLoginModal)
