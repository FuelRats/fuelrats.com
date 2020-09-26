// Module imports
import React from 'react'





// Component imports
import { authenticated } from '~/components/AppLayout'
import RadioInput from '~/components/RadioInput'
import RatTagsInput from '~/components/RatTagsInput'
import RescuesTagsInput from '~/components/RescuesTagsInput'
import getRatTag from '~/helpers/getRatTag'
import { connect } from '~/store'


// Component constants
const epicTypeRadioOptions = [
  {
    value: 'epicRescue',
    label: 'A rat, or group of rats, who performed an epic rescue.',
    title: 'This option nominates all rats assigned to a rescue for an epic laurel.',
  },
  {
    value: 'epicPlayer',
    label: 'A rat who has done something awesome!',
    title: 'This option nominates an individual rat for an epic laurel.',
  },
]


const getResourceIdListString = (resources) => {
  return resources.map((resource) => {
    return resource.id
  }).join(',')
}





@authenticated
@connect
class EpicNominate extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    epicType: 'epicRescue',
    error: null,
    notes: '',
    rats: [],
    rescue: [],
    submitted: false,
    submitting: false,
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static getPageMeta () {
    return {
      title: 'Epic Nomination',
    }
  }

  handleEpicTypeChange = ({ target }) => {
    this.setState({
      epicType: target.value,
      rats: [],
      rescue: [],
    })
  }

  handleRatsChange = (value) => {
    const newRatIds = getResourceIdListString(value)
    const oldRatIds = getResourceIdListString(this.state.rats)

    if (newRatIds !== oldRatIds) {
      this.setState({ rats: value })
    }
  }

  handleRescuesChange = (value) => {
    const newRescueId = getResourceIdListString(value)
    const oldRescueId = getResourceIdListString(this.state.rescue)

    if (newRescueId !== oldRescueId) {
      this.setState((state) => {
        const newState = { ...state }

        if (value.length) {
          const [rescue] = value
          newState.rats = rescue?.relationships?.rats?.data ?? []
        }

        newState.rescue = value

        return newState
      })
    }
  }

  handleNotesChange = (event) => {
    return this.setState({ notes: event.target.value })
  }


  _handleSubmit = async (event) => {
    event.preventDefault()

    const {
      rats,
      rescue,
      notes,
    } = this.state

    this.setState({
      submitting: true,
    })


    let responses = await Promise.all(rats.map((rat) => {
      return this.props.createEpic({
        ratId: rat.id,
        rescueId: rescue.length ? rescue[0].id : null,
        notes,
      })
    }))
    responses = responses.filter((response) => {
      return response?.error === true
    })

    if (responses.length) {
      this.setState({
        error: true,
        submitting: false,
      })
      return
    }

    this.setState({
      submitted: true,
      submitting: false,
    })
  }

  render () {
    const {
      error,
      submitted,
      submitting,
      epicType,
      rats,
      rescue,
      notes,
    } = this.state

    return (
      <>

        {
          (error && !submitting) && (
            <div className="store-errors">
              <div className="store-error">
                <span className="detail">{'Error submitting nomination.'}</span>
              </div>
            </div>
          )
        }

        {
          !submitted && (
            <form
              className={['page-content', { 'loading loader-force': submitting }]}
              onSubmit={this._handleSubmit}>
              <fieldset>
                <label htmlFor="epic-type">{'Who are you nominating for an epic today?'}</label>

                <RadioInput
                  className="epic-type"
                  defaultValue="epicRescue"
                  id="epic-type"
                  name="epic-type"
                  options={epicTypeRadioOptions}
                  value={epicType}
                  onChange={this.handleEpicTypeChange} />
              </fieldset>

              {
                epicType === 'epicRescue' && (
                  <fieldset>
                    <label htmlFor="rescues">{'What is the ID of the rescue?'}</label>

                    <RescuesTagsInput
                      data-single
                      aria-label="Rescue ID"
                      disabled={submitting}
                      id="rescues"
                      name="rescues"
                      value={rescue}
                      onChange={this.handleRescuesChange} />
                  </fieldset>
                )
              }

              {
                epicType === 'epicPlayer' && (
                  <fieldset>
                    <label htmlFor="rats">{"What is the rat's CMDR name?"}</label>

                    <RatTagsInput
                      data-single
                      aria-label="Commander name"
                      disabled={submitting}
                      id="rats"
                      name="rats"
                      value={rats}
                      valueProp={getRatTag}
                      onChange={this.handleRatsChange} />
                  </fieldset>
                )
              }

              <fieldset>
                <label htmlFor="notes">{'What did the rat(s) do that makes them so epic?'}</label>

                <textarea
                  aria-label="epic nominee explaination"
                  disabled={submitting}
                  id="notes"
                  name="notes"
                  value={notes}
                  onChange={this.handleNotesChange} />
              </fieldset>


              <menu type="toolbar">
                <div className="primary">
                  <button
                    disabled={submitting || !this.validate()}
                    type="submit">
                    {submitting ? 'Submitting...' : 'Submit Nomination'}
                  </button>
                </div>

                <div className="secondary" />
              </menu>
            </form>
          )
        }

        {
          submitted && (
            <div>
              <h3>{'Thanks!'}</h3>
              <p>{'Your epic nomination has been submitted. If approved, the rats nominated will be notified that they are now epic rats!'}</p>
              <p>{'Note that while we track who nominates who, the nominees will never be notified of who made the original nomination for their epic deed.'}</p>
            </div>
          )
        }
      </>
    )
  }

  validate = () => {
    const {
      epicType,
      notes,
      rats,
      rescue,
    } = this.state

    if (!notes.length) {
      return false
    }

    if (epicType === 'epicRescue' && !rescue.length) {
      return false
    }

    if (!rats.length) {
      return false
    }

    return true
  }

  static mapDispatchToProps = ['createEpic']
}





export default EpicNominate
