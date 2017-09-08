// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'
import PasswordField from './PasswordField'





class ChangePasswordForm extends Component {

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
      currentPassword: '',
      newPassword: '',
      submitting: false,
    }
  }

  handleChange (event) {
    let newState = {}
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
      currentPassword,
      newPassword,
    } = this.state

    this.setState({ submitting: true })

    await this.props.changePassword(currentPassword, newPassword)

    this.setState({ submitting: false })
  }

  render () {
    let {
      currentPassword,
      newPassword,
      submitting,
    } = this.state

    return(
      <form onSubmit={this.onSubmit}>
        <header>
          <h3>Change Password</h3>
        </header>

        <fieldset data-name="Current Password">
          <label htmlFor="currentPassword">
            Current Password
          </label>

          <PasswordField
            id="currentPassword"
            name="currentPassword"
            onChange={this.handleChange}
            value={currentPassword} />
        </fieldset>

        <fieldset data-name="New Password">
          <label htmlFor="newPassword">
            New Password
          </label>

          <PasswordField
            id="newPassword"
            name="newPassword"
            onChange={this.handleChange}
            showStrength={true}
            value={newPassword} />
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <button
              disabled={!currentPassword || !newPassword || submitting}
              type="submit">
              {submitting ? 'Submitting...' : 'Change Password'}
            </button>
          </div>

          <div className="secondary"></div>
        </menu>
      </form>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    changePassword: bindActionCreators(actions.changePassword, dispatch),
  }
}





export default withRedux(initStore, null, mapDispatchToProps)(ChangePasswordForm)
