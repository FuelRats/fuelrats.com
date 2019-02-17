// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import Component from './Component'





@connect
class AddRatForm extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    name: '',
    platform: 'pc',
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubmit = async (event) => {
    const {
      createRat,
      userId,
    } = this.props
    const {
      name,
      platform,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    await createRat(name, platform, userId)

    this.setState({ submitting: false })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      name,
      platform,
      submitting,
    } = this.state

    return (
      <form
        className="add-rat"
        onSubmit={this._handleSubmit}>
        <div className="stretch-12">
          <label htmlFor="add-rat">Add a rat</label>
        </div>

        <div className="row">
          <div className="input-group stretch-9">
            <input
              aria-label="Commander Name"
              disabled={submitting}
              id="add-rat"
              name="add-rat"
              onChange={(event) => this.setState({ name: event.target.value })}
              placeholder="CMDR Name"
              type="text" />

            <input
              aria-label="P C Commander"
              defaultChecked={platform === 'pc'}
              hidden
              id="platform-pc"
              name="platform"
              onChange={(event) => this.setState({ platform: event.target.value })}
              type="radio"
              value="pc" />
            <label
              className="button"
              htmlFor="platform-pc">
              PC
            </label>

            <input
              aria-label="Xbox Commander"
              defaultChecked={platform === 'xb'}
              hidden
              id="platform-xb"
              name="platform"
              onChange={(event) => this.setState({ platform: event.target.value })}
              type="radio"
              value="xb" />
            <label
              className="button"
              htmlFor="platform-xb">
              XB
            </label>

            <input
              aria-label="Playsation Commander"
              defaultChecked={platform === 'ps'}
              hidden
              id="platform-ps"
              name="platform"
              onChange={(event) => this.setState({ platform: event.target.value })}
              type="radio"
              value="ps" />
            <label
              className="button"
              htmlFor="platform-ps">
              PS
            </label>
          </div>

          <button
            aria-label="Add Commander"
            disabled={!name || submitting}
            type="submit">
            Add
          </button>
        </div>
      </form>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['createRat']

  static mapStateToProps = (state) => {
    const {
      id,
    } = state.user

    return {
      userId: id,
    }
  }
}





export default AddRatForm
