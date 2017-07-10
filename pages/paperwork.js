// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import withRedux from 'next-redux-wrapper'





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





class Paperwork extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    let { id } = this.props

    if (id) {
      this.props.retrievePaperwork(id)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.rescue) {
      this.setState(nextProps.rescue)
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods(['onSubmit', 'handleChange', 'handleFirstLimpetChange', 'handleRatsChange', 'handleSystemChange'])

    this.state = {
      codeRed: false,
      firstLimpet: null,
      notes: '',
      platform: 'pc',
      rats: [],
      successful: true,
      system: null,
    }
  }

  static async getInitialProps ({ query }) {
    let { id } = query

    if (id) {
      return { id }
    }

    return {}
  }

  handleChange (event) {
    let newState = {}
    let target = event.target
    let attribute = target.name
    let value = target.type === 'checkbox' ? target.checked : target.value

    if (value === 'true') {
      value = true

    } else if (value === 'false') {
      value = false
    }

    newState[attribute] = value

    this.setState(newState)
  }

  handleFirstLimpetChange (value) {
    this.handleTagInputChange('firstLimpet', value)
  }

  handleRatsChange (value) {
    this.handleTagInputChange('rats', value)
  }

  handleSystemChange (value) {
    this.handleTagInputChange('system', value)
  }

  handleTagInputChange (prop, value) {
    let newState = {}

    newState[prop] = value

    this.setState(newState)
  }

  onSubmit (event) {
    event.preventDefault()

    let paperwork = Object.assign({}, this.state)

    paperwork.firstLimpet = paperwork.firstLimpet[0].id
    paperwork.rats = paperwork.rats.map(rat => rat.id)
    paperwork.system = paperwork.system[0].value

    this.validate()

    this.props.submitPaperwork(paperwork)
  }

  render () {
    let {
      retrieving,
      submitting,
    } = this.props

    let {
      codeRed,
      firstLimpet,
      notes,
      platform,
      rats,
      successful,
      system,
    } = this.state

    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
        </header>

        <form onSubmit={this.onSubmit}>
          <fieldset>
            <label htmlFor="rats">Who arrived for the rescue?</label>

            <RatTagsInput
              disabled={submitting || retrieving}
              name="rats"
              onChange={this.handleRatsChange}
              value={rats} />
          </fieldset>

          <fieldset>
            <label htmlFor="firstLimpet">Who fired the first limpet?</label>

            <FirstLimpetInput
              disabled={submitting || retrieving}
              name="firstLimpet"
              onChange={this.handleFirstLimpetChange}
              options={rats}
              data-single
              value={firstLimpet} />
          </fieldset>

          <fieldset>
            <label htmlFor="system">Where did it happen? <small>In what star system did the rescue took place? (put "n/a" if not applicable)</small></label>

            <SystemTagsInput
              disabled={submitting || retrieving}
              name="system"
              onChange={this.handleSystemChange}
              data-single
              value={system} />
          </fieldset>

          <fieldset>
            <label>What platform was the rescue on?</label>

            <div className="option-group">
              <input
                defaultChecked={platform === 'pc'}
                disabled={submitting || retrieving}
                id="platform-pc"
                name="platform"
                onChange={this.handleChange}
                type="radio"
                value="pc" /> <label htmlFor="platform-pc">PC</label>

              <input
                defaultChecked={platform === 'xb'}
                disabled={submitting || retrieving}
                id="platform-xb"
                name="platform"
                onChange={this.handleChange}
                type="radio"
                value="xb" /> <label htmlFor="platform-xb">Xbox One</label>

              <input
                defaultChecked={platform === 'ps'}
                disabled={submitting || retrieving}
                id="platform-ps"
                name="platform"
                onChange={this.handleChange}
                type="radio"
                value="ps" /> <label htmlFor="platform-ps">Playstation 4</label>
            </div>
          </fieldset>

          <fieldset>
            <label>Was the rescue successful?</label>

            <div className="option-group">
              <input
                defaultChecked={successful}
                disabled={submitting || retrieving}
                id="successful-yes"
                name="successful"
                onChange={this.handleChange}
                type="radio"
                value={true} /> <label htmlFor="successful-yes">Yes</label>

              <input
                defaultChecked={!successful}
                disabled={submitting || retrieving}
                id="successful-no"
                name="successful"
                onChange={this.handleChange}
                type="radio"
                value={false} /> <label htmlFor="successful-no">No</label>
            </div>
          </fieldset>

          <fieldset>
            <label>Was it a code red?</label>

            <div className="option-group">
              <input
                defaultChecked={codeRed}
                disabled={submitting || retrieving}
                id="codeRed-yes"
                name="codeRed"
                onChange={this.handleChange}
                type="radio"
                value={true} /> <label htmlFor="codeRed-yes">Yes</label>

              <input
                defaultChecked={!codeRed}
                disabled={submitting || retrieving}
                id="codeRed-no"
                name="codeRed"
                onChange={this.handleChange}
                type="radio"
                value={false} /> <label htmlFor="codeRed-no">No</label>
            </div>
          </fieldset>

          <fieldset>
            <label htmlFor="notes">Notes</label>

            <textarea
              disabled={submitting || retrieving}
              id="notes"
              name="notes"
              onChange={this.handleChange}
              value={notes} />
          </fieldset>

          <menu type="toolbar">
            <div className="primary">
              <button
                disabled={submitting || retrieving || !this.validate()}
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
      firstLimpet,
      rats,
      system,
    } = this.state

    if (!firstLimpet) {
      return false
    }

    if (!rats || !rats.length) {
      return false
    }

    if (!system) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Paperwork'
  }
}





const mapDispatchToProps = dispatch => {
  return {
    submitPaperwork: bindActionCreators(actions.submitPaperwork, dispatch),
    retrievePaperwork: bindActionCreators(actions.retrievePaperwork, dispatch),
  }
}

const mapStateToProps = state => {
  return state.paperwork
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Paperwork)
