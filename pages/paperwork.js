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
import RatTagsInput from '../components/RatTagsInput'
import SystemTagsInput from '../components/SystemTagsInput'





class Paperwork extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

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

    this.props.submitPaperwork(this.state)
  }

  render () {
    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
        </header>

        <form onSubmit={this.onSubmit}>
          <fieldset>
            <label htmlFor="rats">Who arrived for the rescue?</label>

            <RatTagsInput
              disabled={this.props.submitting}
              name="rats"
              onChange={this.handleRatsChange} />
          </fieldset>

          <fieldset>
            <label htmlFor="firstLimpet">Who fired the first limpet?</label>

            <RatTagsInput
              disabled={this.props.submitting}
              name="firstLimpet"
              onChange={this.handleFirstLimpetChange}
              data-single />
          </fieldset>

          <fieldset>
            <label htmlFor="system">Where did it happen? <small>In what star system did the rescue took place? (put "n/a" if not applicable)</small></label>

            <SystemTagsInput
              disabled={this.props.submitting}
              name="system"
              onChange={this.handleSystemChange}
              data-single />
          </fieldset>

          <fieldset>
            <label>What platform was the rescue on?</label>

            <div className="option-group">
              <input
                defaultChecked="true"
                disabled={this.props.submitting}
                id="platform-pc"
                name="platform"
                onChange={this.handleChange}
                type="radio"
                value="pc" /> <label htmlFor="platform-pc">PC</label>

              <input
                disabled={this.props.submitting}
                id="platform-xb"
                name="platform"
                onChange={this.handleChange}
                type="radio"
                value="xb" /> <label htmlFor="platform-xb">Xbox One</label>

              <input
                disabled={this.props.submitting}
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
                defaultChecked="true"
                disabled={this.props.submitting}
                id="successful-yes"
                name="successful"
                onChange={this.handleChange}
                type="radio"
                value={true} /> <label htmlFor="successful-yes">Yes</label>

              <input
                disabled={this.props.submitting}
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
                defaultChecked="true"
                disabled={this.props.submitting}
                id="codeRed-yes"
                name="codeRed"
                onChange={this.handleChange}
                type="radio"
                value={true} /> <label htmlFor="codeRed-yes">Yes</label>

              <input
                disabled={this.props.submitting}
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
              disabled={this.props.submitting}
              id="notes"
              name="notes"
              onChange={this.handleChange}></textarea>
          </fieldset>

          <menu type="toolbar">
            <div className="primary">
              <button
                disabled={this.props.submitting}
                type="submit">
                {this.props.submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            <div className="secondary"></div>
          </menu>
        </form>
      </Page>
    )
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
  }
}

const mapStateToProps = state => {
  return state.paperwork
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Paperwork)
