// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import withRedux from 'next-redux-wrapper'





// Component imports
import { actions } from '../store'
import Component from '../components/Component'
import Page from '../components/Page'
import PasswordField from '../components/PasswordField'
import FirstLimpetInput from '../components/FirstLimpetInput'
import RatTagsInput from '../components/RatTagsInput'
import SystemTagsInput from '../components/SystemTagsInput'





// Component imports
const title = 'Register'





class Register extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods([
      'handleChange',
      'onSubmit',
    ])

    this.state = {
      email: '',
      nickname: '',
      password: '',
      passwordStrength: 0,
      passwordSuggestions: null,
      passwordWarning: null,
      ratName: '',
      ratPlatform: 'pc',
      recaptchaResponse: null,
      recaptchaLoaded: false,
      showPassword: false,
      submitting: false,
    }
  }

  handleChange (event) {
    let newState = Object.assign({}, this.state)
    let {
      name,
      value,
    } = event.target
    let attribute = name

    newState[attribute] = value

    this.setState(newState)
  }

  async onSubmit (event) {
    event.preventDefault()

    let {
      email,
      nickname,
      password,
      ratName,
      ratPlatform,
      recaptchaResponse,
    } = this.state

    await this.props.register(email, password, ratName, ratPlatform, nickname, recaptchaResponse)
  }

  render () {
    let {
      email,
      nickname,
      password,
      passwordStrength,
      passwordSuggestions,
      passwordWarning,
      ratName,
      ratPlatform,
      showPassword,
      submitting,
    } = this.state

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        <form onSubmit={this.onSubmit}>
          <fieldset data-name="Email">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              onChange={this.handleChange}
              placeholder="i.e. surly_badger@gmail.com"
              ref={_emailEl => this._emailEl = _emailEl}
              required={true}
              type="email"
              value={email} />
          </fieldset>

          <fieldset data-name="Password">
            <label htmlFor="password">
              Password
            </label>

            <PasswordField
              id="password"
              maxLength="42"
              minLength="5"
              name="password"
              onChange={this.handleChange}
              pattern="^[^\s]{5,42}$"
              placeholder="Use a strong password to keep your account secure"
              ref={_password => this._password = _password}
              required={true}
              showStrength={true}
              showSuggestions={true} />
          </fieldset>

          <fieldset data-name="IRC Nick">
            <label htmlFor="nickname">
              What's your <strong>base</strong> IRC nickname? <small>Base means your nickname without any suffixes, i.e. Surly_Badger instead of Surly_Badger[PC].</small>
            </label>

            <input
              id="nickname"
              name="nickname"
              onChange={this.handleChange}
              pattern="^[A-z_\-\[\]\\^{}|`][A-z0-9_\-\[\]\\^{}|`]+$"
              placeholder="Surly_Badger"
              ref={_nicknameEl => this._nicknameEl = _nicknameEl}
              required={true}
              type="text"
              value={nickname} />
          </fieldset>

          <fieldset data-name="CMDR Name">
            <label htmlFor="ratName">
              What's your CMDR name? <small>If you have more than one CMDR, you can add the rest later.</small>
            </label>

            <input
              id="ratName"
              name="ratName"
              onChange={this.handleChange}
              pattern="^[\x00-\x7F]+$"
              placeholder="Surly Badger"
              ref={_ratNameEl => this._ratNameEl = _ratNameEl}
              required={true}
              type="text"
              value={ratName} />
          </fieldset>

          <fieldset data-name="Platform">
            <label>What platform is this CMDR on?</label>

            <div className="option-group">
              <input
                checked={ratPlatform === 'pc'}
                disabled={submitting}
                id="platform-pc"
                name="ratPlatform"
                onChange={this.handleChange}
                type="radio"
                value="pc" />
              <label htmlFor="platform-pc">PC</label>

              <input
                checked={ratPlatform === 'xb'}
                disabled={submitting}
                id="platform-xb"
                name="ratPlatform"
                onChange={this.handleChange}
                type="radio"
                value="xb" />
              <label htmlFor="platform-xb">Xbox One</label>

              <input
                checked={ratPlatform === 'ps'}
                disabled={submitting}
                id="platform-ps"
                name="ratPlatform"
                onChange={this.handleChange}
                type="radio"
                value="ps" />
              <label htmlFor="platform-ps">Playstation 4</label>
            </div>
          </fieldset>

          <fieldset data-name="Agreements">
            <p>By creating an account I agree that I have read and agree to the <Link href="/terms-of-service"><a>Terms of Service</a></Link> and the <Link href="/privacy-policy"><a>Privacy Policy</a></Link>, and that I am 13 years of age or older.</p>
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
    )
  }
//          <fieldset data-name="CAPTCHA">
//            <ReCAPTCHA
//              onChange={response => this.setState({ recaptchaResponse: response })}
//              sitekey="6LdUsBoUAAAAAN6I4Q34F1psdkShTlvH4OZXQJGg" />
//          </fieldset>

  validate () {
    let {
      email,
      nickname,
      password,
      ratName,
      recaptchaResponse,
    } = this.state

//    if (!recaptchaResponse) {
//      return false
//    }

    if (!this._emailEl || !this._nicknameEl || !this._password || !this._ratNameEl) {
      return false
    }

    if (!this._emailEl.validity.valid || !this._password.validity.valid || !this._nicknameEl.validity.valid || !this._ratNameEl.validity.valid) {
      return false
    }

    if (nickname === password) {
      return false
    }

    return true
  }
}





const mapDispatchToProps = dispatch => {
  return {
    register: bindActionCreators(actions.register, dispatch),
  }
}





export default Page(Register, title, {
  mapDispatchToProps,
})
