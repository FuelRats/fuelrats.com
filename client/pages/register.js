// Module imports
import React from 'react'





// Component imports
import { actions, connect } from '../store'
import { Link } from '../routes'
import {
  commanderPattern,
  ircNickPattern,
  passwordPattern,
} from '../data/RegExpr'
import { PageWrapper } from '../components/AppLayout'
import PasswordField from '../components/PasswordField'
import RadioInput from '../components/RadioInput'
import WordpressTermsModal from '../components/TermsModal'





@connect
class Register extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    checkedTOS: false,
    acceptTerms: true,
    acceptPrivacy: true,
    email: '',
    nickname: '',
    password: '',
    ratName: '',
    ratPlatform: '',
    recaptchaResponse: null,
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    const {
      name,
      type,
    } = target

    const value = type === 'checkbox' ? target.checked : target.value

    if (name !== 'password') {
      sessionStorage.setItem(`register.${name}`, value)
    }

    this.setState({
      [name]: value,
      ...(name === 'acceptTerms' ? { acceptPrivacy: value } : {}),
    })
  }

  _handleTOSChange = () => {
    const {
      acceptTerms,
      acceptPrivacy,
      checkedTOS,
    } = this.state

    if (!acceptTerms && !acceptPrivacy && !checkedTOS) {
      this.setState({ checkedTOS: true })
    }

    if (acceptTerms && acceptPrivacy) {
      this.setState({ acceptPrivacy: false, acceptTerms: false, checkedTOS: false })
    }
  }

  _handleRadioInputChange = ({ target }) => {
    const { name, value } = target
    sessionStorage.setItem(`register.${name}`, value)
    this.setState({ [name]: value })
  }

  _handleSubmit = async (event) => {
    event.preventDefault()

    const {
      email,
      nickname,
      password,
      ratName,
      ratPlatform,
      recaptchaResponse,
    } = this.state

    this.setState({ submitting: true })

    const { status: regStatus } = await this.props.register({
      email,
      password,
      name: ratName,
      platform: ratPlatform,
      nickname,
      recaptcha: recaptchaResponse,
    })

    if (regStatus === 'success') {
      await this.props.login({
        email,
        password,
        route: 'profile',
        routeParams: { fl: '1' },
      })
    } else {
      this.setState({ submitting: false })
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    await actions.getWordpressPage('terms-of-service')(store.dispatch)
    await actions.getWordpressPage('privacy-policy')(store.dispatch)
  }

  componentDidMount () {
    this.setState((state) => ({
      acceptTerms: sessionStorage.getItem('register.acceptTerms'),
      acceptPrivacy: sessionStorage.getItem('register.acceptTerms'),
      email: sessionStorage.getItem('register.email') || state.email,
      nickname: sessionStorage.getItem('register.nickname') || state.nickname,
      ratName: sessionStorage.getItem('register.ratName') || state.ratName,
      ratPlatform: sessionStorage.getItem('register.ratPlatform') || state.ratPlatform,
    }))
  }

  render () {
    const {
      checkedTOS,
      acceptTerms,
      acceptPrivacy,
      email,
      nickname,
      ratName,
      ratPlatform,
      submitting,
    } = this.state

    return (
      <PageWrapper
        displayTitle="Become a Rat"
        title="Register">
        <form
          className={`${submitting ? 'loading force' : ''}`}
          data-loader-text="Submitting"
          onSubmit={this._handleSubmit}>

          <fieldset data-name="Email">
            <h5>This registration page is to become a Fuel Rat! <br /> Need fuel? No need to register! Just click "Get Help" in the sidebar!</h5><br />
            <label htmlFor="email">
              Email
            </label>

            <input
              aria-label="email"
              id="email"
              name="email"
              disabled={submitting}
              onChange={this._handleChange}
              placeholder="i.e. surly_badger@gmail.com"
              ref={(_emailEl) => {
                this._emailEl = _emailEl
              }}
              required
              type="email"
              value={email} />
          </fieldset>

          <fieldset data-name="Password">
            <label htmlFor="password">
              Password
            </label>

            <PasswordField
              disabled={submitting}
              id="password"
              maxLength="42"
              minLength="5"
              name="password"
              onChange={this._handleChange}
              pattern={passwordPattern}
              placeholder="Use a strong password to keep your account secure"
              ref={(_password) => {
                this._password = _password
              }}
              required
              showStrength
              showSuggestions />
          </fieldset>

          <fieldset data-name="IRC Nick">
            <label htmlFor="nickname">
              What's your <strong>base</strong> IRC nickname? <small>Base means your nickname without any suffixes, i.e. Surly_Badger instead of Surly_Badger[PC].</small>
            </label>

            <input
              aria-label="Base IRC Nickname"
              disabled={submitting}
              id="nickname"
              name="nickname"
              onChange={this._handleChange}
              pattern={ircNickPattern}
              placeholder="Surly_Badger"
              ref={(_nicknameEl) => {
                this._nicknameEl = _nicknameEl
              }}
              required
              type="text"
              value={nickname} />
          </fieldset>

          <fieldset data-name="CMDR Name">
            <label htmlFor="ratName">
              What's your CMDR name? <small>If you have more than one CMDR, you can add the rest later.</small>
            </label>

            <input
              aria-label="Commander name"
              disabled={submitting}
              id="ratName"
              name="ratName"
              onChange={this._handleChange}
              minLength={1}
              maxLength={18}
              pattern={commanderPattern}
              placeholder="Surly Badger"
              ref={(_ratNameEl) => {
                this._ratNameEl = _ratNameEl
              }}
              required
              type="text"
              value={ratName} />
          </fieldset>

          <fieldset data-name="Platform">
            <label>What platform is your CMDR on?</label>

            <RadioInput
              disabled={submitting}
              className="ratPlatform"
              name="ratPlatform"
              id="ratPlatform"
              value={ratPlatform}
              onChange={this._handleRadioInputChange}
              options={[
                {
                  value: 'pc',
                  label: 'PC',
                },
                {
                  value: 'xb',
                  label: 'Xbox',
                },
                {
                  value: 'ps',
                  label: 'PS4',
                },
              ]} />
          </fieldset>

          <fieldset data-name="Agreements">
            <span>
              <input
                aria-label="Terms of"
                className="large"
                disabled={submitting}
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={Boolean(acceptTerms && acceptPrivacy)}
                onChange={this._handleTOSChange} />
              <label htmlFor="acceptTerms">
                {'I agree that I have read and agree to the  '}
                <Link route="wordpress" params={{ slug: 'terms-of-service' }}>
                  <a>Terms of Service</a>
                </Link>
                {' and '}
                <Link route="wordpress" params={{ slug: 'privacy-policy' }}>
                  <a>Privacy Policy</a>
                </Link>
                {', and that I am 13 years of age or older.'}
              </label>
            </span>
          </fieldset>

          <menu type="toolbar">
            <div className="primary position-vertical">
              <button
                disabled={submitting || !this.canRegister}
                className="green"
                title="Don't want to rescue people? You're in the wrong place."
                type="submit">
                {submitting ? 'Submitting...' : 'I want to rescue others!'}
              </button>
            </div>

            <div className="secondary" />
          </menu>
        </form>


        <WordpressTermsModal
          isOpen={checkedTOS && !acceptTerms && !acceptPrivacy}
          onClose={() => this.setState({ acceptTerms: true })}
          title="Terms of Service"
          slug="terms-of-service"
          checkboxLabel="I have read and agree to these Terms of Service" />

        <WordpressTermsModal
          isOpen={checkedTOS && acceptTerms && !acceptPrivacy}
          onClose={() => {
            this.setState({ acceptPrivacy: true })
            sessionStorage.setItem('register.acceptTerms', true)
          }}
          title="Privacy Policy"
          slug="privacy-policy"
          checkboxLabel="I have read and agree to this Privacy Policy" />

      </PageWrapper>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get canRegister () {
    const {
      acceptTerms,
      acceptPrivacy,
      nickname,
      password,
      ratPlatform,
    } = this.state

    if (!this._emailEl || !this._nicknameEl || !this._password || !this._ratNameEl) {
      return false
    }

    if (!this._emailEl.validity.valid || !this._password.validity.valid || !this._nicknameEl.validity.valid || !this._ratNameEl.validity.valid) {
      return false
    }

    if (nickname === password) {
      return false
    }

    if (!ratPlatform) {
      return false
    }

    if (!acceptTerms || !acceptPrivacy) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['register', 'login']
}




export default Register
