// Module imports
import React from 'react'





// Component imports
import { actions, connect } from '../store'
import { Link } from '../routes'
import Component from '../components/Component'
import PageWrapper from '../components/PageWrapper'
import PasswordField from '../components/PasswordField'
import RadioOptionsInput from '../components/RadioOptionsInput'
import TermsDialog from '../components/TermsDialog'





// Component constants
/* eslint-disable react/no-danger */
const getWordpressPageElement = (page) => (
  <div dangerouslySetInnerHTML={{ __html: page.content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">') }} />
)
/* eslint-enable react/no-danger */





@connect
class Register extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.setState({
      acceptTerms: sessionStorage.getItem('register.acceptTerms'),
      acceptPrivacy: sessionStorage.getItem('register.acceptTerms'),
      email: sessionStorage.getItem('register.email') || '',
      nickname: sessionStorage.getItem('register.nickname') || '',
      ratName: sessionStorage.getItem('register.ratName') || '',
      ratPlatform: sessionStorage.getItem('register.ratPlatform') || 'pc',
    })
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'handleChange',
      'handleRadioOptionsChange',
      '_handleSubmit',
    ])

    this.state = {
      acceptTerms: true,
      acceptPrivacy: true,
      email: '',
      nickname: '',
      password: '',
      ratName: '',
      ratPlatform: 'pc',
      recaptchaResponse: null,
      submitting: false,
    }
  }

  static async getInitialProps ({ store }) {
    await actions.getWordpressPage('terms-of-service')(store.dispatch)
    await actions.getWordpressPage('privacy-policy')(store.dispatch)
  }

  handleChange ({ target }) {
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

  handleRadioOptionsChange ({ name, value }) {
    sessionStorage.setItem(`register.${name}`, value)
    this.setState({ [name]: value })
  }

  async _handleSubmit (event) {
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

  render () {
    const {
      termsPage,
      privacyPage,
    } = this.props

    const {
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
        title="register">
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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
              pattern="^[^\s]{5,42}$"
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
              onChange={this.handleChange}
              pattern="^[A-z_\-\[\]\\^{}|`][A-z0-9_\-\[\]\\^{}|`]+$"
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
              onChange={this.handleChange}
              pattern="^[\x00-\x7F]+$"
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

            <RadioOptionsInput
              disabled={submitting}
              className="ratPlatform"
              name="ratPlatform"
              id="ratPlatform"
              value={ratPlatform}
              onChange={this.handleRadioOptionsChange}
              options={[
                {
                  value: 'pc',
                  displayValue: 'PC',
                },
                {
                  value: 'xb',
                  displayValue: 'Xbox',
                },
                {
                  value: 'ps',
                  displayValue: 'PS4',
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
                onChange={this.handleChange} />
              <label htmlFor="acceptTerms">
                {'I agree that I have read and agree to the  '}
                <Link route="wordpress" params={{ slug: 'terms-of-service' }}>
                  <a>Terms of Service</a>
                </Link>
                {' and '}
                <Link route="wordpress" params={{ slug: 'terms-of-service' }}>
                  <a>Privacy Policy</a>
                </Link>
                {', and that I am 13 years of age or older.'}
              </label>
            </span>
          </fieldset>

          <menu type="toolbar">
            <div className="primary position-vertical">
              <button
                disabled={submitting || !this.validate()}
                className="green"
                title="Don't want to rescue people? You're in the wrong place."
                type="submit">
                {submitting ? 'Submitting...' : 'I want to rescue others!'}
              </button>
            </div>

            <div className="secondary" />
          </menu>
        </form>

        { !acceptTerms && !acceptPrivacy && (
          <TermsDialog
            dialogContent={() => getWordpressPageElement(termsPage)}
            onClose={() => this.setState({ acceptTerms: true })}
            title="Terms of Service"
            checkboxLabel="I have read and agree to these Terms of Service" />
        )}

        { acceptTerms && !acceptPrivacy && (
          <TermsDialog
            dialogContent={() => getWordpressPageElement(privacyPage)}
            onClose={() => {
              this.setState({ acceptPrivacy: true })
              sessionStorage.setItem('register.acceptTerms', true)
            }}
            title="Privacy Policy"
            checkboxLabel="I have read and agree to this Privacy Policy" />
        )}

      </PageWrapper>
    )
  }

  validate () {
    const {
      acceptTerms,
      acceptPrivacy,
      nickname,
      password,
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

    if (!acceptTerms || !acceptPrivacy) {
      return false
    }

    return true
  }

  static mapStateToProps = (state) => ({
    termsPage: state.wordpress.page['terms-of-service'],
    privacyPage: state.wordpress.page['privacy-policy'],
  })

  static mapDispatchToProps = ['register', 'login']
}




export default Register
