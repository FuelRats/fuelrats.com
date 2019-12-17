// Module imports
import React from 'react'
import { createSelector } from 'reselect'





// Component imports
import { PageWrapper, authenticated } from '../../../components/AppLayout'
import FirstLimpetInput from '../../../components/FirstLimpetInput'
import RadioInput from '../../../components/RadioInput'
import RatTagsInput from '../../../components/RatTagsInput'
import SystemTagsInput from '../../../components/SystemTagsInput'
import { formatAsEliteDateTime } from '../../../helpers/formatTime'
import getRatTag from '../../../helpers/getRatTag'
import userHasPermission from '../../../helpers/userHasPermission'
import { Router } from '../../../routes'
import { actions, connect } from '../../../store'
import {
  selectRatsByRescueId,
  selectRescueById,
  selectUserById,
  selectGroupsByUserId,
  withCurrentUserId,
} from '../../../store/selectors'




// Component constants
const PAPERWORK_MAX_EDIT_TIME = 3600000


const selectFormattedRatsByRescueId = createSelector(
  selectRatsByRescueId,
  (rats) => (rats
    ? rats
      .map((rat) => ({
      ...rat,
      value: rat.attributes.name,
      }))
      .reduce((accumulator, rat) => ({
        ...accumulator,
        [rat.id]: rat,
      }), {})
    : []),
)





@authenticated
@connect
class Paperwork extends React.Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  state = {
    loading: !this.props.rescue,
    submitting: false,
    error: null,
    changes: {},
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    const {
      name,
      value,
    } = target

    this._setChanges({
      [name]: value,
    })
  }

  _handleNotesChange = (event) => this._setChanges({ notes: event.target.value })

  _handleRadioInputChange = ({ target }) => {
    const attribute = target.name
    let { value } = target

    if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }

    const changes = {}

    if (attribute === 'platform' && value !== this.props.rescue) {
      changes.firstLimpetId = null
      changes.rats = {}
    }

    if (attribute === 'outcome' && value !== 'success') {
      changes.firstLimpetId = null
    }

    this._setChanges({
      ...changes,
      [attribute]: value,
    })
  }

  _handleFirstLimpetChange = (value) => {
    // Because tagsInput sometimes decides to randomly call onChange when it hasn't changed.
    if (typeof this.state.changes.firstLimpetId === 'undefined' && value.length && value[0].id === this.props.rescue.attributes.firstLimpetId) {
      return
    }

    let newValue = null

    if (value.length) {
      if (value[0].id === this.props.rescue.attributes.firstLimpetId) {
        newValue = undefined
      } else {
        newValue = value
      }
    }

    this._setChanges({ firstLimpetId: newValue })
  }

  _handleSystemChange = (value) => {
    // Because tagsInput sometimes decides to randomly call onChange when it hasn't changed.
    if (typeof this.state.changes.system === 'undefined' && value.length && value[0].value === this.props.rescue.attributes.system) {
      return
    }

    let newValue = null

    if (value.length) {
      if (value[0].value === this.props.rescue.attributes.system) {
        newValue = undefined
      } else {
        newValue = value
      }
    }

    this._setChanges({ system: newValue })
  }

  _handleRatsChange = (value) => {
    this._setChanges({ rats: value })
  }

  _handleRatsRemove = (rat) => {
    const firstLimpetId = (this.state.changes.firstLimpetId && this.state.changes.firstLimpetId[0].id) || this.props.rescue.attributes.firstLimpetId
    if (rat.id === firstLimpetId) {
      this._handleFirstLimpetChange([])
    }
  }

  _handleSubmit = async (event) => {
    event.preventDefault()

    const { rescue } = this.props
    const {
      rats,
      ...changes
    } = this.state.changes

    if (!rescue.attributes.outcome && !changes.outcome) {
      return
    }

    if (changes.firstLimpetId) {
      if (changes.firstLimpetId.length && changes.firstLimpetId[0].id !== rescue.attributes.firstLimpetId) {
        changes.firstLimpetId = changes.firstLimpetId[0].id
      } else {
        changes.firstLimpetId = undefined
      }
    }

    if (changes.system) {
      if (changes.system.length && changes.system[0].value !== rescue.attributes.system) {
        changes.system = changes.system[0].value.toUpperCase()
      } else {
        changes.system = undefined
      }
    }

    if (rats) {
      await this.props.updateRescueRats(rescue.id, rats.map(({ id, type }) => ({ id, type })))
    }

    const { status } = await this.props.updateRescue(rescue.id, changes)

    if (status === 'error') {
      this.setState({ error: true })
      return
    }

    Router.pushRoute('paperwork', { rescueId: rescue.id })
  }

  _setChanges = (changedFields) => this.setState((prevState) => ({
    changes: {
      ...prevState.changes,
      ...Object.entries(changedFields).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: this.props.rescue.attributes[key] === value ? undefined : value,
      }), {}),
    },
  }))

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const { id, rescue } = this.props

    if (id && !rescue) {
      await this.props.getRescue(id)
    }

    if (this.state.loading) {
      this.setState({ loading: false })
    }
  }

  static renderQuote = (quote, index) => {
    const createdAt = formatAsEliteDateTime(quote.createdAt)
    const updatedAt = formatAsEliteDateTime(quote.updatedAt)
    return (
      <li key={index}>
        <div className="times">
          <div className="created" title="Created at">{createdAt}</div>
          {(updatedAt !== createdAt) && (
            <div className="updated" title="Updated at"><span className="label">Updated at </span>{updatedAt}</div>
          )}
        </div>
        <span className="message">{quote.message}</span>
        <div className="authors">
          <div className="author" title="Created by">{quote.author}</div>
          {(quote.author !== quote.lastAuthor) && (
            <div className="last-author" title="Last updated by"><span className="label">Updated by </span>{quote.lastAuthor}</div>
          )}
        </div>
      </li>
    )
  }

  renderQuotes = () => {
    const { rescue } = this.props

    if (rescue.attributes.quotes) {
      return (
        <ol>
          {rescue.attributes.quotes.map(Paperwork.renderQuote)}
        </ol>
      )
    }

    return (
      <span>N/A</span>
    )
  }

  static async getInitialProps ({ query, store }) {
    const state = store.getState()

    if (!selectRescueById(state, query)) {
      await actions.getRescue(query.rescueId)(store.dispatch)
    }
  }

  renderRescueEditForm = () => {
    const {
      rescue,
    } = this.props

    const {
      loading,
      submitting,
    } = this.state

    const classes = ['page-content']

    if (loading || submitting) {
      classes.push('loading', 'force')
    }

    const fieldValues = this.getFieldValues()

    const {
      codeRed,
      firstLimpetId,
      notes,
      outcome,
      platform,
      rats,
      system,
    } = fieldValues

    const pwValidity = this.validate(fieldValues)

    return (
      <form
        className={classes.join(' ')}
        onSubmit={this._handleSubmit}>
        <header className="paperwork-header">
          {(rescue.attributes.status !== 'closed') && (
            <div className="board-index"><span>#{rescue.attributes.data.boardIndex}</span></div>
          )}
          <div className="title">
            {(!rescue.attributes.title) && (
              <span>
                    Rescue of
                <span className="cmdr-name"> {rescue.attributes.client}</span> in
                <span className="system"> {(rescue.attributes.system) || ('Unknown')}</span>
              </span>
            )}
            {(rescue.attributes.title) && (
              <span>
                    Operation
                <span className="rescue-title"> {rescue.attributes.title}</span>
              </span>
            )}
          </div>
        </header>

        <fieldset>
          <label htmlFor="platform">What platform was the rescue on?</label>

          <RadioInput
            disabled={submitting || loading}
            className="platform"
            name="platform"
            id="platform"
            value={platform}
            onChange={this._handleRadioInputChange}
            options={[
              {
                value: 'pc',
                label: 'PC',
                title: 'Personal Computational Device',
              },
              {
                value: 'xb',
                label: 'Xbox',
                title: 'Xbox One',
              },
              {
                value: 'ps',
                label: 'PS4',
                title: 'Playstation 4',
              },
            ]} />
        </fieldset>

        <fieldset>
          <label htmlFor="outcome-success">
            Was the rescue successful?
            <a
              className="inline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.fuelr.at/caseguide"
              title="How to file cases - Fuel Rats Confluence">
              <small> (How do I choose?)</small>
            </a>
          </label>

          <RadioInput
            disabled={submitting || loading}
            className="outcome"
            name="outcome"
            id="outcome"
            value={outcome}
            onChange={this._handleRadioInputChange}
            options={[
              {
                value: 'success',
                label: 'Yes',
                title: 'Fuel was successfully delivered to the client.',
              },
              {
                value: 'failure',
                label: 'No',
                title: 'Fuel wasn\'t successfully delivered to the client. (Explain why)',
              },
              {
                value: 'invalid',
                label: 'Invalid',
                title: 'Fuel wasn\'t delievered because the request was illegitimate. (Cats / Trolling)',
              },
              {
                value: 'other',
                label: 'Other',
                title: 'Fuel wasn\'t delievered because the client was able to get out of trouble without it. (Explain)',
              },
            ]} />
        </fieldset>

        <fieldset>
          <label htmlFor="codeRed-yes">Was it a code red?</label>
          <RadioInput
            disabled={submitting || loading}
            className="codeRed"
            name="codeRed"
            id="codeRed"
            value={`${codeRed}`}
            onChange={this._handleRadioInputChange}
            options={[
              {
                value: 'true',
                label: 'Yes',
                title: '$#!7 was on fire, yo.',
              },
              {
                value: 'false',
                label: 'No',
                title: 'The client did not experience any undue stress.',
              },
            ]} />
        </fieldset>

        <fieldset>
          <label htmlFor="rats">Who was assigned to this rescue?</label>

          <RatTagsInput
            aria-label="Assigned rats"
            data-platform={platform}
            disabled={submitting || loading}
            name="rats"
            onChange={this._handleRatsChange}
            onRemove={this._handleRatsRemove}
            value={rats}
            valueProp={getRatTag} />
        </fieldset>

        <fieldset>
          <label htmlFor="firstLimpetId">Who fired the first limpet?</label>

          <FirstLimpetInput
            data-single
            disabled={submitting || loading || (outcome !== 'success')}
            name="firstLimpetId"
            onChange={this._handleFirstLimpetChange}
            options={rats}
            value={firstLimpetId}
            valueProp={getRatTag} />
        </fieldset>

        <fieldset>
          <label htmlFor="system">Where did it happen? <small>In what star system did the rescue took place? (put "n/a" if not applicable)</small></label>

          <SystemTagsInput
            aira-label="Rescue system"
            data-allownew
            disabled={submitting || loading}
            name="system"
            onChange={this._handleSystemChange}
            data-single
            value={system} />
        </fieldset>

        <fieldset>
          <label htmlFor="notes">Notes</label>

          <textarea
            aria-label="case notes"
            disabled={submitting || loading}
            id="notes"
            name="notes"
            onChange={this._handleNotesChange}
            value={notes} />
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <div className={`invalidity-explainer ${pwValidity.noChange ? 'no-change' : ''} ${pwValidity.valid ? '' : 'show'}`}>{pwValidity.reason}</div>
            <button
              disabled={submitting || loading || !pwValidity.valid}
              className="green"
              type="submit">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <div className="secondary" />
        </menu>

        <div className="panel quotes">
          <header>Quotes</header>
          <div className="panel-content">{this.renderQuotes()}</div>
        </div>
      </form>
    )
  }

  render () {
    const {
      rescue,
    } = this.props

    const {
      loading,
      submitting,
      error,
    } = this.state

    return (
      <PageWrapper title="Paperwork">
        {(error && !submitting) && (
          <div className="store-errors">
            <div className="store-error">
              Error while submitting paperwork.
            </div>
          </div>
        )}

        {loading && (
          <div className="loading page-content" />
        )}

        {(!loading && !rescue) && (
          <div className="loading page-content">
            <p>Sorry, we couldn't find the paperwork you requested.</p>
          </div>
        )}

        {(!loading && rescue) && this.renderRescueEditForm()}
      </PageWrapper>
    )
  }

  lastInvalidReason = null

  validate (values) {
    const { rescue } = this.props
    const { changes } = this.state

    let invalidReason = null
    let noChange = false

    if (!rescue) {
      return {
        valid: false,
        reason: 'Rescue Not Found',
      }
    }

    switch (values.outcome) {
      case 'other':
      case 'invalid':
        invalidReason = this.validateCaseWithInvalidOutcome(values)
        break

      case 'success':
      case 'failure':
        invalidReason = this.validateCaseWithValidOutcome(values)
        break

      default:
        invalidReason = 'Outcome is not set!'
        break
    }

    if (!this.userCanEdit) {
      invalidReason = 'You cannot edit this rescue.'
    }

    if (invalidReason === null && !Object.keys(changes).length) {
      invalidReason = 'No changes have been made yet!'
      noChange = true
    }

    const response = {
      valid: Boolean(invalidReason === null),
      reason: invalidReason || this.lastInvalidReason,
      noChange,
    }

    this.lastInvalidReason = invalidReason

    return response
  }

  validateCaseWithValidOutcome = (values) => {
    if (!values.rats || !values.rats.length) {
      return 'Valid cases must have at least one rat assigned.'
    }

    if (!values.system) {
      return 'Valid cases must have a star system location.'
    }

    if (!values.platform) {
      return 'Valid cases must have a platform.'
    }

    if (values.outcome === 'success' && !values.firstLimpetId) {
      return 'Successful rescues must have a first limpet rat.'
    }

    if (values.outcome === 'failure' && !values.notes.replace(/\s/gu, '')) {
      return 'Invalid cases must have notes explaining why the rescue is invalid.'
    }

    return null
  }

  validateCaseWithInvalidOutcome = (values) => {
    if (!values.notes.replace(/\s/gu, '')) {
      return 'Invalid cases must have notes explaining why the rescue is invalid.'
    }

    return null
  }

  getFieldValues () {
    const { rescue, rats } = this.props
    const { changes } = this.state

    const isDefined = (value, fallback) => (typeof value === 'undefined' ? fallback : value)
    const getValue = (value) => isDefined(changes[value], rescue.attributes[value])




    return {
      codeRed: getValue('codeRed'),
      firstLimpetId: isDefined(changes.firstLimpetId, rats[rescue.attributes.firstLimpetId]) || null,
      notes: getValue('notes'),
      outcome: getValue('outcome'),
      platform: getValue('platform'),
      rats: Object.values(isDefined(changes.rats, rats)),
      system: isDefined(changes.system, rescue.attributes.system ? { value: rescue.attributes.system.toUpperCase() } : null),
    }
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get userCanEdit () {
    const {
      rescue,
      currentUser,
      currentUserGroups,
    } = this.props

    if (!rescue || !currentUser.relationships) {
      return false
    }

    // Check if current user is assigned to case.
    const assignedRatIds = rescue.relationships.rats.data.map((rat) => rat.id)
    const currentUserRatIds = currentUser.relationships.rats.data.map((rat) => rat.id)

    if (assignedRatIds.some((ratId) => currentUserRatIds.includes(ratId))) {
      return true
    }

    // Check if the paperwork is not yet time locked
    if ((new Date()).getTime() - (new Date(rescue.attributes.createdAt)).getTime() <= PAPERWORK_MAX_EDIT_TIME) {
      return true
    }

    // Check if user has the permission to edit the paperwork anyway
    if (currentUserGroups.length && userHasPermission(currentUserGroups, 'rescue.write')) {
      return true
    }

    return false
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['updateRescue', 'updateRescueRats', 'getRescue']

  static mapStateToProps = (state, { query }) => ({
    rats: selectFormattedRatsByRescueId(state, query),
    rescue: selectRescueById(state, query),
    currentUser: withCurrentUserId(selectUserById)(state),
    currentUserGroups: withCurrentUserId(selectGroupsByUserId)(state),
  })
}





export default Paperwork
