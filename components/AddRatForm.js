// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import Component from './Component'




@connect
class AddRatForm extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods(['onSubmit'])

    this.state = {
      name: '',
      platform: 'pc',
      submitting: false,
    }
  }

  async onSubmit (event) {
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

  render () {
    const {
      name,
      platform,
      submitting,
    } = this.state

    return (
      <form
        className="add-rat"
        onSubmit={this.onSubmit}>
        <div className="stretch-12">
          <label htmlFor="add-rat">Add a rat</label>
        </div>

        <div className="row">
          <div className="input-group stretch-9">
            <input
              disabled={submitting}
              id="add-rat"
              name="add-rat"
              onChange={event => this.setState({ name: event.target.value })}
              placeholder="CMDR Name"
              type="text" />

            <input
              defaultChecked={platform === 'pc'}
              hidden
              id="platform-pc"
              name="platform"
              onChange={event => this.setState({ platform: event.target.value })}
              type="radio"
              value="pc" />
            <label
              className="button"
              htmlFor="platform-pc">
              PC
            </label>

            <input
              defaultChecked={platform === 'xb'}
              hidden
              id="platform-xb"
              name="platform"
              onChange={event => this.setState({ platform: event.target.value })}
              type="radio"
              value="xb" />
            <label
              className="button"
              htmlFor="platform-xb">
              XB
            </label>

            <input
              defaultChecked={platform === 'ps'}
              hidden
              id="platform-ps"
              name="platform"
              onChange={event => this.setState({ platform: event.target.value })}
              type="radio"
              value="ps" />
            <label
              className="button"
              htmlFor="platform-ps">
              PS
            </label>
          </div>

          <button
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

  static mapStateToProps = state => {
    const {
      id,
    } = state.user

    return {
      userId: id,
    }
  }
}





export default AddRatForm
