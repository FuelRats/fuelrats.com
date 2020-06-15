// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { produce } from 'immer'
import React from 'react'





// Component imports
import { connect } from '~/store'
import { selectCurrentUserId } from '~/store/selectors'

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

const platformSelectOptions = {
  pc: 'PC',
  xb: 'XB1',
  ps: 'PS4',
}


@connect
class AddRatForm extends React.Component {
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
      attributes: {
        name: name.trim(),
        platform,
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: userId,
          },
        },
      },
    })

    this.setState({ ...initialState })
  }

  _handleToggle = () => {
    this.setState((state) => {
      return {
        ...initialState,
        formOpen: !state.formOpen,
      }
    })
  }

  _handleFieldChange = ({ target, valid, message }) => {
    this.setState(produce((draftState) => {
      const { name, value } = target

      draftState[name] = value

      if (typeof draftState.validity[name] !== 'undefined') {
        draftState.validity[name] = valid || message
      }
    }))
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
      <form className={['add-rat compact', { 'form-open': formOpen }]}>
        {
          formOpen && (
            <div className="form-row submit-row flex align-center">
              <ValidatedFormInput
                required
                aria-label="Commander Name"
                className="cmdr-input"
                disabled={submitting}
                id="newRatName"
                invalidMessage={INVALID_NAME_MESSAGE}
                label="CMDR Name"
                maxLength={22}
                minLength={1}
                name="name"
                placeholder="CMDR Name"
                value={name}
                onChange={this._handleFieldChange} />

              <ValidatedFormSelect
                required
                className="platform-input"
                disabled={submitting}
                id="newRatPlatform"
                invalidMessage={INVALID_PLATFORM_MESSAGE}
                label="Platform"
                name="platform"
                options={platformSelectOptions}
                value={platform}
                onChange={this._handleFieldChange} />
            </div>
          )
        }
        <div className="form-control">
          {
            formOpen && (
              <button
                aria-label="submit new commander"
                className="green compact square"
                disabled={!this.canSubmit}
                type="button"
                onClick={this._handleSubmit}>
                <FontAwesomeIcon fixedWidth icon="check" />
              </button>
            )
          }
          <button
            aria-label={formOpen ? 'cancel new commander creation' : 'add commander'}
            className={['compact square', { green: !formOpen }]}
            title={formOpen ? 'Cancel' : 'Add new commander'}
            type="button"
            onClick={this._handleToggle}>
            <FontAwesomeIcon fixedWidth icon={formOpen ? 'times' : 'plus'} />
          </button>
        </div>
      </form>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get canSubmit () {
    const {
      name,
      platform,
      validity,
    } = this.state

    const isValid = Object.values(validity).filter((validityMember) => {
      return validityMember
    }).length

    return name && platform && isValid
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['createRat']

  static mapStateToProps = (state, ownProps) => {
    return {
      userId: ownProps.userId || selectCurrentUserId(state),
    }
  }
}





export default AddRatForm
