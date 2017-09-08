// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import zxcvbn from 'zxcvbn'





// Component imports
import {
  actions,
  initStore,
} from '../store'
import Component from '../components/Component'
import Page from '../components/Page'
import FirstLimpetInput from '../components/FirstLimpetInput'
import RatTagsInput from '../components/RatTagsInput'
import SystemTagsInput from '../components/SystemTagsInput'





class Register extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods(['handleChange'])

    this.state = {
      email: '',
      password: '',
      passwordStrength: 0,
      passwordSuggestions: null,
      passwordWarning: null,
      ratName: '',
      ratPlatform: 'pc',
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

    if (attribute === 'password') {
      let {
        email,
        password,
        ratName,
      } = this.state

      let passwordEvaluation = zxcvbn(value, [email, ratName])

      newState.passwordStrength = passwordEvaluation.score
      newState.passwordSuggestions = passwordEvaluation.feedback.suggestions.join('\A')
      newState.passwordWarning = passwordEvaluation.feedback.warning
    }

    this.setState(newState)
  }

  async onSubmit (event) {
    event.preventDefault()

    let {
      email,
      password,
      ratName,
      ratPlatform,
    } = this.state

    console.log('onSubmit')

//    await this.props.submitPaperwork(rescue.id, rescueUpdates, ratUpdates)
  }

  render () {
    let {
      email,
      password,
      passwordStrength,
      passwordSuggestions,
      passwordWarning,
      ratName,
      ratPlatform,
      showPassword,
      submitting,
    } = this.state
    let {
      path,
    } = this.props

    return (
      <Page path={path} title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <form onSubmit={this.onSubmit}>
          <fieldset>
            <label>Email</label>

            <input
              name="email"
              onChange={this.handleChange}
              type="text"
              value={email} />
          </fieldset>

          <fieldset>
            <label>Password</label>

            <div className="password-group">
              <div className="input-group">
                <input
                  name="password"
                  onChange={this.handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={password} />

                <button
                  className={showPassword ? 'show' : 'hide'}
                  onClick={() => this.setState({ showPassword: !showPassword })}
                  type="button">
                  {!showPassword && (
                    <i className="fa fa-eye" />
                  )}
                  {showPassword && (
                    <i className="fa fa-eye-slash" />
                  )}
                </button>
              </div>

              <meter
                className="password-strength-meter"
                data-warning={passwordWarning}
                data-suggestions={passwordSuggestions}
                hidden={!password}
                high="3"
                low="2"
                max="4"
                optimum="4"
                value={passwordStrength} />
            </div>
          </fieldset>

          <fieldset>
            <label>What's your CMDR name? <small>If you have more than one CMDR, you can add the rest later.</small></label>

            <input
              name="ratName"
              onChange={this.handleChange}
              type="text"
              value={ratName} />
          </fieldset>

          <fieldset>
            <label>What platform is this CMDR on?</label>

            <div className="option-group">
              <input
                checked={ratPlatform === 'pc'}
                disabled={submitting}
                id="platform-pc"
                name="ratPlatform"
                onChange={this.handleChange}
                type="radio"
                value="pc" /> <label htmlFor="platform-pc">PC</label>

              <input
                checked={ratPlatform === 'xb'}
                disabled={submitting}
                id="platform-xb"
                name="ratPlatform"
                onChange={this.handleChange}
                type="radio"
                value="xb" /> <label htmlFor="platform-xb">Xbox One</label>

              <input
                checked={ratPlatform === 'ps'}
                disabled={submitting}
                id="platform-ps"
                name="ratPlatform"
                onChange={this.handleChange}
                type="radio"
                value="ps" /> <label htmlFor="platform-ps">Playstation 4</label>
            </div>
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
      </Page>
    )
  }

  validate () {
    let {
      email,
      password,
      ratName,
    } = this.state

    return true
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Register'
  }
}





const mapDispatchToProps = dispatch => {
  return {
  }
}





export default withRedux(initStore, null, mapDispatchToProps)(Register)
