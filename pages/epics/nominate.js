// Component imports
import RadioOptionsInput from '../../components/RadioOptionsInput'
import RescuesTagsInput from '../../components/RescuesTagsInput'
import RatTagsInput from '../../components/RatTagsInput'
import Component from '../../components/Component'
import Page from '../../components/Page'
import classNames from '../../helpers/classNames'





// Component constants
const title = 'Epic Nomination'





class EpicNominate extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods([
      'onSubmit',
      'handleEpicTypeChange',
      'handleNotesChange',
      'handleRatsChange',
      'handleRescuesChange',
    ])

    this.state = {
      epicType: 'epicRescue',
      error: null,
      notes: '',
      rats: [],
      rescue: [],
      submitted: false,
      submitting: false,
    }
  }


  handleEpicTypeChange (newValue) {
    if (this.state.epicType !== newValue.value) {
      this.setState({
        epicType: newValue.value,
        rats: [],
        rescue: [],
      })
    }
  }


  handleRatsChange (value) {
    const newRatIds = value.map(rat => rat.id).join(',')
    const oldRatIds = this.state.rats.map(rat => rat.id).join(',')
    if (newRatIds !== oldRatIds) {
      this.setState({ rats: value })
    }
  }

  handleRescuesChange (value) {
    const newRescueId = value.map(rescue => rescue.id).join('')
    const oldRescueId = this.state.rescue.map(rescue => rescue.id).join('')
    if (newRescueId !== oldRescueId) {
      const newState = { ...this.state }

      if (value.length) {
        const [rescue] = value
        newState.rats =
          rescue.relationships &&
          rescue.relationships.rats &&
          rescue.relationships.rats.data &&
          rescue.relationships.rats.data.length ?
            rescue.relationships.rats.data : []
      }

      newState.rescue = value
      this.setState(newState)
    }
  }

  handleNotesChange (event) {
    this.setState({ notes: event.target.value })
  }

  async onSubmit (event) {
    event.preventDefault()

    const {
      rats,
      rescue,
      notes,
    } = this.state

    this.setState({
      submitting: true,
    })


    let responses = await Promise.all(rats.map(rat => this.props.createEpic({
      ratId: rat.id,
      rescueId: rescue.length ? rescue[0].id : null,
      notes,
    })))
    responses = responses.filter(({ status }) => status === 'error')

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

    const classes = classNames(
      'page-content',
      ['loading', submitting],
      ['force', submitting],
    )

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        {(error && !submitting) && (
          <div className="store-errors">
            <div className="store-error">
              Error submitting nomination.
            </div>
          </div>
        )}

        {!submitted && (
          <form
            className={classes}
            onSubmit={this.onSubmit}>
            <fieldset>
              <label htmlFor="epic-type">Who are you nominating for an epic today?</label>

              <RadioOptionsInput
                className="epic-type"
                name="epic-type"
                id="epic-type"
                defaultValue="epicRescue"
                value={epicType}
                onChange={this.handleEpicTypeChange}
                options={[
                  {
                    value: 'epicRescue',
                    displayValue: 'A rat, or group of rats, who performed an epic rescue.',
                    title: 'This option nominates all rats assigned to a rescue for an epic laurel.',
                  },
                  {
                    value: 'epicPlayer',
                    displayValue: 'A rat who has done something awesome!',
                    title: 'This option nominates an individual rat for an epic laurel.',
                  },
                ]} />
            </fieldset>

            { epicType === 'epicRescue' && (
              <fieldset>
                <label htmlFor="rescues">What is the ID of the rescue?</label>

                <RescuesTagsInput
                  data-single
                  disabled={submitting}
                  id="rescues"
                  name="rescues"
                  onChange={this.handleRescuesChange}
                  value={rescue} />
              </fieldset>
            )}

            { epicType === 'epicPlayer' && (
              <fieldset>
                <label htmlFor="rats">What is the rat's CMDR name?</label>

                <RatTagsInput
                  data-single
                  disabled={submitting}
                  id="rats"
                  name="rats"
                  onChange={this.handleRatsChange}
                  value={rats}
                  valueProp={rat => `${rat.attributes.name} [${rat.attributes.platform.toUpperCase()}]`} />
              </fieldset>
            )}

            <fieldset>
              <label htmlFor="notes">What did the rat(s) do that makes them so epic?</label>

              <textarea
                disabled={submitting}
                id="notes"
                name="notes"
                onChange={this.handleNotesChange}
                value={notes} />
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
        )}

        {submitted && (
          <div>
            <h3>Thanks!</h3>
            <p>Your epic nomination has been submitted. If approved, the rats nominated will be notified that they are now considered epic rats!</p>
            <p>Note that while we track who nominates who, the nominees will never be notified of who made the original nomination for their epic deed.</p>
          </div>
        )}
      </div>
    )
  }

  validate () {
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
}

const mapDispatchToProps = ['createEpic']



export default Page(EpicNominate, title, { mapDispatchToProps }, true)
