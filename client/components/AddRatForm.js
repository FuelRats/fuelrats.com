// Module imports
import React from 'react'





// Component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from '../store'
import { selectUser } from '../store/selectors'
import Component from './Component'
import ValidatedFormInput from './ValidatedFormInput'
import ValidatedFormSelect from './ValidatedFormSelect'





// Component Constants
const INVALID_NAME_MESSAGE = 'CMDR Name is Required'
const INVALID_PLATFORM_MESSAGE = 'Platform is Required'
const initialState = {
  formOpen: false,
  name: '',
  platform: '',
  validity: {
    name: INVALID_NAME_MESSAGE,
    platform: INVALID_PLATFORM_MESSAGE,
  },
  submitting: false,
}




@connect
class AddRatForm extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    ...initialState,
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

    await createRat({
      name,
      platform,
      userId,
    })

    this.setState({ ...initialState })
  }

  _handleToggle = () => {
    this.setState((state) => ({
      ...initialState,
      formOpen: !state.formOpen,
    }))
  }

  _handleFieldChange = ({ target, valid, message }) => {
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
              [name]: valid || message,
            },
          }
          : {}),
      }
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      name,
      platform,
      submitting,
      formOpen,
    } = this.state

    return (
      <form className="add-rat compact">
        {formOpen && (
          <div className="form-row submit-row flex align-center">
            <ValidatedFormInput
              aria-label="Commander Name"
              className="cmdr-input"
              disabled={submitting}
              id="newRatName"
              invalidMessage={INVALID_NAME_MESSAGE}
              label="CMDR Name"
              name="name"
              onChange={(event) => this.setState({ name: event.target.value })}
              placeholder="CMDR Name"
              required
              value={name} />

            <ValidatedFormSelect
              className="platform-input"
              disabled={submitting}
              id="newRatPlatform"
              invalidMessage={INVALID_PLATFORM_MESSAGE}
              name="platform"
              label="Platform"
              onChange={this._handleFieldChange}
              options={{
                pc: 'PC',
                xb: 'XB1',
                ps: 'PS4',
              }}
              required
              value={platform} />
          </div>
        )}
        <div className="form-control">
          {formOpen && (
            <button
              aria-label="Submit New Commander"
              className="green compact square"
              disabled={!this.isValid}
              onClick={this._handleSubmit}
              type="button">
              <FontAwesomeIcon icon="check" fixedWidth />
            </button>
          )}
          <button
            aria-label="Add Commander"
            className={`compact square ${formOpen ? '' : 'green'}`}
            disabled={!this.isValid}
            onClick={this._handleToggle}
            title={formOpen ? 'Cancel' : 'Add new commander'}
            type="button">
            <FontAwesomeIcon icon={formOpen ? 'times' : 'plus'} fixedWidth />
          </button>
        </div>
      </form>
    )
  }


  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isValid () {
    const invalidStates = Object.values(this.state.validity).filter((value) => value !== true)
    return invalidStates.length ? invalidStates[0] : true
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['createRat']

  static mapStateToProps = (state, ownProps) => ({
    userId: ownProps.userId || selectUser(state).id,
  })
}





export default AddRatForm
