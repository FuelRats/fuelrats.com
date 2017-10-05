// Module imports
import { bindActionCreators } from 'redux'
import React from 'react'
import { connect } from 'react-redux'





// Component imports
import { actions } from '../store'
import Component from './Component'





class AddNicknameForm extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods(['onSubmit'])

    this.state = {
      nickname: '',
      submitting: false,
    }
  }

  async onSubmit (event) {
    let { addNickname } = this.props
    let {
      nickname,
      password,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    await addNickname(nickname, prompt(`Please enter your IRC password (this may be different from your website password):`))

    this.setState({
      nickname: '',
      submitting: false,
    })
  }

  render () {
    let {
      nickname,
      submitting,
    } = this.state

    return (
      <form
        className="row"
        onSubmit={this.onSubmit}>
        <input
          className="stretch-9"
          name="add-nickname"
          onChange={event => this.setState({ nickname: event.target.value })}
          placeholder="Add a nickname..."
          type="text"
          value={nickname}/>
        <button
          disabled={!nickname || submitting}
          type="submit">Add</button>
      </form>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    addNickname: bindActionCreators(actions.addNickname, dispatch),
  }
}





export default connect(null, mapDispatchToProps)(AddNicknameForm)
