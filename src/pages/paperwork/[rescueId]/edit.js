// Module imports
import { isError } from 'flux-standard-action'
import React from 'react'
import { createSelector } from 'reselect'





// Component imports
import { authenticated } from '~/components/AppLayout'
import FirstLimpetInput from '~/components/FirstLimpetInput'
import RadioInput from '~/components/RadioInput'
import RatTagsInput from '~/components/RatTagsInput'
import SystemTagsInput from '~/components/SystemTagsInput'
import platformRadioOptions from '~/data/platformRadioOptions'
import { formatAsEliteDateTime } from '~/helpers/formatTime'
import getRatTag from '~/helpers/getRatTag'
import { Router } from '~/routes'
import { connect } from '~/store'
import { getRescue } from '~/store/actions/rescues'
import {
  selectRatsByRescueId,
  selectRescueById,
  selectCurrentUserCanEditRescue,
} from '~/store/selectors'





// Component constants
const selectFormattedRatsByRescueId = createSelector(
  selectRatsByRescueId,
  (rats) => {
    return (rats?.reduce((accumulator, rat) => {
      return {
        ...accumulator,
        [rat.id]: {
          ...rat,
          value: rat.attributes.name,
        },
      }
    }, {}) ?? {})
  },
)

const codeRedRadioOptions = [
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
]

const outcomeRadioOptions = [
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
    title: 'Fuel wasn\'t delivered because the request was illegitimate. (Cats / Trolling)',
  },
  {
    value: 'other',
    label: 'Other',
    title: 'Fuel wasn\'t delivered because the client was able to get out of trouble without it. (Explain)',
  },
]




@authenticated
@connect
class Paperwork extends React.Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  state = {
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

  _handleNotesChange = (event) => {
    return this._setChanges({ notes: event.target.value })
  }

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
      firstLimpetId,
      ...changes
    } = this.state.changes

    if (!rescue.attributes.outcome && !changes.outcome) {
      return
    }

    if (changes.system) {
      if (changes.system.length && changes.system[0].value !== rescue.attributes.system) {
        changes.system = changes.system[0].value.toUpperCase()
      } else {
        changes.system = undefined
      }
    }

    const updateData = {
      id: rescue.id,
      attributes: changes,
      relationships: {},
    }

    if (firstLimpetId?.length && firstLimpetId[0].id !== rescue.relationships.firstLimpet?.data?.id) {
      updateData.relationships.firstLimpet = {
        data: {
          type: 'rats',
          id: firstLimpetId[0].id,
        },
      }
    }

    if (rats) {
      updateData.relationships.rats = {
        data: rats.map(({ type, id }) => {
          return {
            type,
            id,
          }
        }),
      }
    }

    const response = await this.props.updateRescue(updateData)

    if (isError(response)) {
      this.setState({ error: true })
      return
    }

    Router.pushRoute('paperwork', { rescueId: rescue.id })
  }

  _setChanges = (changedFields) => {
    return this.setState((prevState) => {
      return {
        changes: {
          ...prevState.changes,
          ...Object.entries(changedFields).reduce((acc, [key, value]) => {
            return {
              ...acc,
              [key]: this.props.rescue.attributes[key] === value ? undefined : value,
            }
          }, {}),
        },
      }
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static renderQuote = (quote, index) => {
    const createdAt = formatAsEliteDateTime(quote.createdAt)
    const updatedAt = formatAsEliteDateTime(quote.updatedAt)
    return (
      <li key={index}>
        <div className="times">
          <div className="created" title="Created at">{createdAt}</div>
          {
            (updatedAt !== createdAt) && (
              <div className="updated" title="Updated at"><span className="label">{'Updated at '}</span>{updatedAt}</div>
            )
          }
        </div>
        <span className="message">{quote.message}</span>
        <div className="authors">
          <div className="author" title="Created by">{quote.author}</div>
          {
            (quote.author !== quote.lastAuthor) && (
              <div className="last-author" title="Last updated by"><span className="label">{'Updated by '}</span>{quote.lastAuthor}</div>
            )
          }
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
      <span>{'N/A'}</span>
    )
  }

  static async getInitialProps ({ query, store }) {
    const state = store.getState()

    if (!selectRescueById(state, query)) {
      await store.dispatch(getRescue(query.rescueId))
    }
  }

  static getPageMeta () {
    return {
      title: 'Paperwork',
    }
  }

  renderRescueEditForm = () => {
    const {
      rescue,
    } = this.props

    const {
      submitting,
    } = this.state

    const fieldValues = this.getFieldValues()
    const pwValidity = this.validate(fieldValues)

    const {
      codeRed,
      firstLimpetId,
      notes,
      outcome,
      platform,
      rats,
      system,
    } = fieldValues

    return (
      <form
        className={['page-content', { 'loading loader-force': submitting }]}
        onSubmit={this._handleSubmit}>
        <header className="paperwork-header">
          {
            (rescue.attributes.status !== 'closed') && (
              <div className="board-index"><span>{`#${rescue.attributes.data.boardIndex}`}</span></div>
            )
          }
          <div className="title">
            {
              (!rescue.attributes.title) && (
                <span>
                  {'Rescue of '}
                  <span className="cmdr-name">{rescue.attributes.client}</span>
                  {' in '}
                  <span className="system">{(rescue.attributes.system) || 'Unknown'}</span>
                </span>
              )
            }
            {
              (rescue.attributes.title) && (
                <span>
                  {'Operation '}
                  <span className="rescue-title"> {rescue.attributes.title}</span>
                </span>
              )
            }
          </div>
        </header>

        <fieldset>
          <label htmlFor="platform">{'What platform was the rescue on?'}</label>

          <RadioInput
            className="platform"
            disabled={submitting}
            id="platform"
            name="platform"
            options={platformRadioOptions}
            value={platform}
            onChange={this._handleRadioInputChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="outcome-success">
            {'Was the rescue successful?'}
            <a
              className="inline"
              href="https://t.fuelr.at/caseguide"
              rel="noopener noreferrer"
              target="_blank"
              title="How to file cases - Fuel Rats Confluence">
              <small>{' (How do I choose?)'}</small>
            </a>
          </label>

          <RadioInput
            className="outcome"
            disabled={submitting}
            id="outcome"
            name="outcome"
            options={outcomeRadioOptions}
            value={outcome}
            onChange={this._handleRadioInputChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="codeRed-yes">{'Was it a code red?'}</label>
          <RadioInput
            className="codeRed"
            disabled={submitting}
            id="codeRed"
            name="codeRed"
            options={codeRedRadioOptions}
            value={`${codeRed}`}
            onChange={this._handleRadioInputChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="rats">{'Who was assigned to this rescue?'}</label>

          <RatTagsInput
            aria-label="Assigned rats"
            data-platform={platform}
            disabled={submitting}
            name="rats"
            value={rats}
            valueProp={getRatTag}
            onChange={this._handleRatsChange}
            onRemove={this._handleRatsRemove} />
        </fieldset>

        <fieldset>
          <label htmlFor="firstLimpetId">{'Who fired the first limpet?'}</label>

          <FirstLimpetInput
            data-single
            disabled={submitting || (outcome !== 'success')}
            name="firstLimpetId"
            options={rats}
            value={firstLimpetId}
            valueProp={getRatTag}
            onChange={this._handleFirstLimpetChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="system">
            {'Where did it happen? '}
            <small>{'In what star system did the rescue took place? (put "n/a" if not applicable)'}</small>
          </label>

          <SystemTagsInput
            data-allownew
            data-single
            aira-label="Rescue system"
            disabled={submitting}
            name="system"
            value={system}
            onChange={this._handleSystemChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="notes">{'Notes'}</label>

          <textarea
            aria-label="case notes"
            disabled={submitting}
            id="notes"
            name="notes"
            value={notes}
            onChange={this._handleNotesChange} />
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <div
              className={['invalidity-explainer', { show: !pwValidity.valid, 'no-change': pwValidity.noChange }]}>
              {pwValidity.reason}
            </div>
            <button
              className="green"
              disabled={submitting || !pwValidity.valid}
              type="submit">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <div className="secondary" />
        </menu>

        <div className="panel quotes">
          <header>{'Quotes'}</header>
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
      submitting,
      error,
    } = this.state

    return (
      <>
        {
          (error && !submitting) && (
            <div className="store-errors">
              <div className="store-error">
                <span className="detail">{'Error while submitting paperwork.'}</span>
              </div>
            </div>
          )
        }

        {
          (!rescue) && (
            <div className="loading page-content">
              <p>{"Sorry, we couldn't find the paperwork you requested."}</p>
            </div>
          )
        }

        {(rescue) && this.renderRescueEditForm()}
      </>
    )
  }

  lastInvalidReason = null

  validate (values) {
    const { rescue, userCanEdit } = this.props
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

    if (!userCanEdit) {
      invalidReason = 'You cannot edit this rescue.'
    }

    if (!invalidReason && !Object.keys(changes).length) {
      invalidReason = 'No changes have been made yet!'
      noChange = true
    }

    const response = {
      valid: !invalidReason,
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

    const ifDefined = (value, fallback) => {
      return typeof value === 'undefined' ? fallback : value
    }

    const getValue = (value) => {
      return ifDefined(changes[value], rescue.attributes[value])
    }

    return {
      codeRed: getValue('codeRed'),
      firstLimpetId: ifDefined(changes.firstLimpetId, rats[rescue.relationships.firstLimpet.data?.id]) ?? null,
      notes: getValue('notes'),
      outcome: getValue('outcome'),
      platform: getValue('platform'),
      rats: Object.values(ifDefined(changes.rats, rats) ?? {}),
      system: ifDefined(changes.system, rescue.attributes.system ? { value: rescue.attributes.system.toUpperCase() } : null),
    }
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['updateRescue', 'getRescue']

  static mapStateToProps = (state, { query }) => {
    return {
      rats: selectFormattedRatsByRescueId(state, query),
      rescue: selectRescueById(state, query),
      userCanEdit: selectCurrentUserCanEditRescue(state, query),
    }
  }
}





export default Paperwork
