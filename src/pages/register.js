// Module imports
import React from 'react'





// Component imports
import PasswordField from '~/components/PasswordField'
import RadioInput from '~/components/RadioInput'
import WordpressTermsModal from '~/components/TermsModal'
import platformRadioOptions from '~/data/platformRadioOptions'
import {
  commanderPattern,
  ircNickPattern,
  passwordPattern,
} from '~/data/RegExpr'
import { Link } from '~/routes'
import { actions, connect } from '~/store'





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

  _emailRef = React.createRef()
  _passwordRef = React.createRef()
  _nicknameRef = React.createRef()
  _ratNameRef = React.createRef()





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    const {
      name,
      type,
    } = target

    const value = type === 'checkbox' ? target.checked : target.value

    this.setState({
      [name]: value,
      ...(name === 'acceptTerms' ? { acceptPrivacy: value } : {}),
    })
  }

  _handleTOSAccept = () => {
    return this.setState({ acceptTerms: true })
  }

  _handlePrivacyAccept = () => {
    this.setState({ acceptPrivacy: true })
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
        routeParams: { tab: 'overview', fl: '1' },
      })
    } else {
      this.setState({ submitting: false })
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    await store.dispatch(actions.getWordpressPage('terms-of-service'))
    await store.dispatch(actions.getWordpressPage('privacy-policy'))
  }

  static getPageMeta () {
    return {
      displayTitle: 'Become a Rat',
      title: 'Register',
    }
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
      <>
        <form
          className={{ 'loading force': submitting }}
          data-loader-text="Submitting"
          onSubmit={this._handleSubmit}>

          <fieldset data-name="Email">
            <h5>{'This registration page is to become a Fuel Rat!'}<br />{'Need fuel? No need to register! Just click "Get Help" in the sidebar!'}</h5>

            <br />

            <label htmlFor="email">
              {'Email'}
            </label>

            <input
              ref={this._emailRef}
              required
              aria-label="email"
              disabled={submitting}
              id="email"
              name="email"
              placeholder="i.e. surly_badger@gmail.com"
              type="email"
              value={email}
              onChange={this._handleChange} />
          </fieldset>

          <fieldset data-name="Password">
            <label htmlFor="password">
              {'Password'}
            </label>

            <PasswordField
              ref={this._passwordRef}
              required
              showStrength
              showSuggestions
              disabled={submitting}
              id="password"
              maxLength="42"
              minLength="5"
              name="password"
              pattern={passwordPattern}
              placeholder="Use a strong password to keep your account secure"
              onChange={this._handleChange} />
          </fieldset>

          <fieldset data-name="IRC Nick">
            <label htmlFor="nickname">
              {"What's your "}
              <strong>{'base'}</strong>
              {' IRC nickname? '}
              <small>{'Base means your nickname without any suffixes, i.e. Surly_Badger instead of Surly_Badger[PC].'}</small>
            </label>

            <input
              ref={this._nicknameRef}
              required
              aria-label="Base IRC Nickname"
              disabled={submitting}
              id="nickname"
              name="nickname"
              pattern={ircNickPattern}
              placeholder="Surly_Badger"
              type="text"
              value={nickname}
              onChange={this._handleChange} />
          </fieldset>

          <fieldset data-name="CMDR Name">
            <label htmlFor="ratName">
              {"What's your CMDR name? "}
              <small>{'If you have more than one CMDR, you can add the rest later.'}</small>
            </label>

            <input
              ref={this._ratNameRef}
              required
              aria-label="Commander name"
              disabled={submitting}
              id="ratName"
              maxLength={22}
              minLength={1}
              name="ratName"
              pattern={commanderPattern}
              placeholder="Surly Badger"
              type="text"
              value={ratName}
              onChange={this._handleChange} />
          </fieldset>

          <fieldset data-name="Platform">
            <label>{'What platform is your CMDR on?'}</label>

            <RadioInput
              className="ratPlatform"
              disabled={submitting}
              id="ratPlatform"
              name="ratPlatform"
              options={platformRadioOptions}
              value={ratPlatform}
              onChange={this._handleRadioInputChange} />
          </fieldset>

          <fieldset data-name="Agreements">
            <span>
              <input
                aria-label="Terms of"
                checked={Boolean(acceptTerms && acceptPrivacy)}
                className="large"
                disabled={submitting}
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                onChange={this._handleTOSChange} />
              <label htmlFor="acceptTerms">
                {'I agree that I have read and agree to the  '}
                <Link params={{ slug: 'terms-of-service' }} route="wordpress">
                  <a>{'Terms of Service'}</a>
                </Link>
                {' and '}
                <Link params={{ slug: 'privacy-policy' }} route="wordpress">
                  <a>{'Privacy Policy'}</a>
                </Link>
                {', and that I am 13 years of age or older.'}
              </label>
            </span>
          </fieldset>

          <menu type="toolbar">
            <div className="primary position-vertical">
              <button
                className="green"
                disabled={submitting || !this.canRegister}
                title="Don't want to rescue people? You're in the wrong place."
                type="submit">
                {submitting ? 'Submitting...' : 'I want to rescue others!'}
              </button>
            </div>

            <div className="secondary" />
          </menu>
        </form>


        <WordpressTermsModal
          checkboxLabel="I have read and agree to these Terms of Service"
          isOpen={checkedTOS && !acceptTerms && !acceptPrivacy}
          slug="terms-of-service"
          title="Terms of Service"
          onClose={this._handleTOSAccept} />

        <WordpressTermsModal
          checkboxLabel="I have read and agree to this Privacy Policy"
          isOpen={checkedTOS && acceptTerms && !acceptPrivacy}
          slug="privacy-policy"
          title="Privacy Policy"
          onClose={this._handlePrivacyAccept} />
      </>
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

    if (
      !this._emailRef.current
      || !this._nicknameRef.current
      || !this._passwordRef.current
      || !this._ratNameRef.current
    ) {
      return false
    }

    if (
      !this._emailRef.current.validity.valid
      || !this._passwordRef.current.validity.valid
      || !this._nicknameRef.current.validity.valid
      || !this._ratNameRef.current.validity.valid
    ) {
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
