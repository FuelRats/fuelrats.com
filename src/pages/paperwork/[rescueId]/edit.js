import { HttpStatus } from '@fuelrats/web-util/http'
import clsx from 'clsx'
import { isError } from 'flux-standard-action'
import Router from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createSelector } from 'reselect'

import { authenticated } from '~/components/AppLayout'
import FirstLimpetInput from '~/components/FirstLimpetInput'
import RadioInput from '~/components/RadioInput'
import RatTagsInput from '~/components/RatTagsInput'
import SystemTagsInput from '~/components/SystemTagsInput'
import platformRadioOptions from '~/data/platformRadioOptions'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { getRescue, updateRescue } from '~/store/actions/rescues'
import {
  selectRatsByRescueId,
  selectRescueById,
  selectCurrentUserCanEditRescue,
} from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import { expansionLongRadioOptions } from '~/util/expansion'
import pageRedirect from '~/util/getInitialProps/pageRedirect'
import setError from '~/util/getInitialProps/setError'
import getRatTag from '~/util/getRatTag'
import getResponseError from '~/util/getResponseError'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'




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

const carrierRadioOptions = [
  { value: 'true', label: 'Yes', title: 'The client is on a fleet carrier.' },
  { value: 'false', label: 'No', title: 'The client is not on a fleet carrier.' },
]

const codeRedRadioOptions = [
  { value: 'true', label: 'Yes', title: '$#!7 was on fire, yo.' },
  { value: 'false', label: 'No', title: 'The client did not experience any undue stress.' },
]

const outcomeRadioOptions = [
  { value: 'success', label: 'Yes', title: 'Fuel was successfully delivered to the client.' },
  { value: 'failure', label: 'No', title: 'Fuel wasn\'t successfully delivered to the client. (Explain why)' },
  { value: 'invalid', label: 'Invalid', title: 'Fuel wasn\'t delivered because the request was illegitimate. (Cats / Trolling)' },
  { value: 'other', label: 'Other', title: 'Fuel wasn\'t delivered because the client was able to get out of trouble without it. (Explain)' },
]


function renderQuote (quote, index) {
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


function getFieldValues (rescue, rats, changes) {
  const ifDefined = (value, fallback) => {
    return typeof value === 'undefined' ? fallback : value
  }
  const getValue = (key) => {
    return ifDefined(changes[key], rescue.attributes[key])
  }

  return {
    carrier: getValue('carrier'),
    client: getValue('client'),
    codeRed: getValue('codeRed'),
    expansion: getValue('expansion'),
    firstLimpetId: ifDefined(
      changes.firstLimpetId,
      rats[rescue.relationships.firstLimpet.data?.id] ?? changes.rats?.find((rat) => {
        return rat.id === rescue?.relationships?.firstLimpet.data?.id
      }),
    ) ?? null,
    notes: getValue('notes'),
    outcome: getValue('outcome'),
    platform: getValue('platform'),
    rats: Object.values(ifDefined(changes.rats, rats) ?? {}),
    system: ifDefined(changes.system, rescue.attributes.system ? { value: rescue.attributes.system.toUpperCase() } : null),
  }
}


function validate (rescue, userCanEdit, changes, values) {
  const errors = {}

  if (!rescue) {
    return { valid: false, errors: { form: 'Rescue Not Found' }, noChange: false }
  }
  if (!userCanEdit) {
    return { valid: false, errors: { form: 'You cannot edit this rescue.' }, noChange: false }
  }

  switch (values.outcome) {
    case 'other':
    case 'invalid':
      if (!values.notes.replace(/\s/gu, '')) {
        errors.notes = 'This outcome requires notes explaining the reason.'
      }
      break

    case 'success':
    case 'failure':
      if (!values.rats || !values.rats.length) {
        errors.rats = 'Must have at least one rat assigned.'
      }
      if (!values.system) {
        errors.system = 'Must have a star system location.'
      }
      if (!values.platform) {
        errors.platform = 'Must have a platform.'
      }
      if (values.outcome === 'success' && !values.firstLimpetId) {
        errors.firstLimpetId = 'Successful rescues must have a first limpet rat.'
      }
      if (values.outcome === 'failure' && !values.notes.replace(/\s/gu, '')) {
        errors.notes = 'Failed cases must have notes explaining what went wrong.'
      }
      break

    default:
      errors.outcome = 'Outcome is not set!'
      break
  }

  const noChange = !Object.keys(errors).length && !Object.keys(changes).length

  return {
    valid: !Object.keys(errors).length && !noChange,
    errors,
    noChange,
  }
}


function Paperwork ({ query }) {
  const dispatch = useDispatch()
  const rats = useSelectorWithProps(query, selectFormattedRatsByRescueId)
  const rescue = useSelectorWithProps(query, selectRescueById)
  const userCanEdit = useSelectorWithProps(query, selectCurrentUserCanEditRescue)

  const [submitting, setSubmitting] = useState(false)
  const [error, setErrorState] = useState(null)
  const [changes, setChangesState] = useState({})

  const hasUnsavedChanges = Object.values(changes).some((value) => {
    return typeof value !== 'undefined'
  })

  // Keep refs for lifecycle handlers so they see the current unsaved state
  // without being re-bound on every change.
  const hasUnsavedRef = useRef(hasUnsavedChanges)
  hasUnsavedRef.current = hasUnsavedChanges
  const submittingRef = useRef(submitting)
  submittingRef.current = submitting

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedRef.current) {
        event.preventDefault()
      }
    }
    const handleRouteChange = () => {
      if (hasUnsavedRef.current && !submittingRef.current) {
        // eslint-disable-next-line no-alert -- intentional confirmation dialog
        if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
          Router.events.emit('routeChangeError')
          // Throw a string to abort the route change.
          // Next.js catches thrown strings from routeChangeStart without logging them as errors.
          // eslint-disable-next-line no-throw-literal
          throw 'Route change aborted'
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    Router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      Router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const setChanges = useCallback((changedFields) => {
    setChangesState((prev) => {
      return {
        ...prev,
        ...Object.entries(changedFields).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: rescue.attributes[key] === value ? undefined : value,
          }
        }, {}),
      }
    })
  }, [rescue])

  const handleChange = useCallback(({ target }) => {
    setChanges({ [target.name]: target.value })
  }, [setChanges])

  const handleNotesChange = useCallback((event) => {
    return setChanges({ notes: event.target.value })
  }, [setChanges])

  const handleRadioInputChange = useCallback(({ target }) => {
    const attribute = target.name
    let { value } = target

    if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }

    const extraChanges = {}
    if (attribute === 'platform' && value !== rescue) {
      extraChanges.firstLimpetId = []
      extraChanges.rats = []
    }
    if (attribute === 'outcome' && value !== 'success') {
      extraChanges.firstLimpetId = []
    }

    setChanges({ ...extraChanges, [attribute]: value })
  }, [setChanges, rescue])

  const handleFirstLimpetChange = useCallback((value) => {
    // Because tagsInput sometimes decides to randomly call onChange when it hasn't changed.
    if (typeof changes.firstLimpetId === 'undefined' && value.length && value[0].id === rescue.relationships.firstLimpet?.data?.id) {
      return
    }

    let newValue = []
    if (value.length) {
      if (value[0].id === rescue.relationships.firstLimpet?.data?.id) {
        newValue = undefined
      } else {
        newValue = value
      }
    }

    setChanges({ firstLimpetId: newValue })
  }, [changes, rescue, setChanges])

  const handleSystemChange = useCallback((value) => {
    // Because tagsInput sometimes decides to randomly call onChange when it hasn't changed.
    if (typeof changes.system === 'undefined' && value.length && value[0].value === rescue.attributes.system) {
      return
    }

    let newValue = null
    if (value.length) {
      if (value[0].value === rescue.attributes.system) {
        newValue = undefined
      } else {
        newValue = value
      }
    }

    setChanges({ system: newValue })
  }, [changes, rescue, setChanges])

  const handleRatsChange = useCallback((value) => {
    setChanges({ rats: value })
  }, [setChanges])

  const handleRatsRemove = useCallback((rat) => {
    const firstLimpetId = changes.firstLimpetId?.[0]?.id ?? rescue.relationships?.firstLimpet?.data?.id ?? null
    if (rat?.id === firstLimpetId) {
      handleFirstLimpetChange([])
    }
  }, [changes, rescue, handleFirstLimpetChange])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    setSubmitting(true)

    const { rats: ratsChange, firstLimpetId, ...remainingChanges } = changes

    if (!rescue.attributes.outcome && !remainingChanges.outcome) {
      return
    }

    if (remainingChanges.system) {
      if (remainingChanges.system.length && remainingChanges.system[0].value !== rescue.attributes.system) {
        remainingChanges.system = remainingChanges.system[0].value.toUpperCase()
      } else {
        remainingChanges.system = undefined
      }
    }

    const updateData = {
      id: rescue.id,
      attributes: remainingChanges,
      relationships: {},
    }

    if (firstLimpetId?.length && firstLimpetId[0].id !== rescue.relationships.firstLimpet?.data?.id) {
      updateData.relationships.firstLimpet = {
        data: { type: 'rats', id: firstLimpetId[0].id },
      }
    } else if (firstLimpetId?.length === 0) {
      updateData.relationships.firstLimpet = { data: null }
    }

    if (Array.isArray(ratsChange)) {
      updateData.relationships.rats = {
        data: ratsChange.map(({ type, id }) => { return { type, id } }),
      }
    }

    const response = await dispatch(updateRescue(updateData))

    if (isError(response)) {
      setErrorState(true)
      setSubmitting(false)
      return
    }

    Router.push(makePaperworkRoute({ rescueId: rescue.id }))
  }, [changes, dispatch, rescue])

  const fieldValues = getFieldValues(rescue, rats, changes)
  const pwValidity = validate(rescue, userCanEdit, changes, fieldValues)
  const { errors = {} } = pwValidity

  const fieldError = (name) => {
    return errors[name] ? <small className="field-error" style={{ display: 'block', color: '#d65050', marginTop: '0.3rem' }}>{errors[name]}</small> : null
  }

  const {
    carrier,
    client,
    codeRed,
    expansion,
    firstLimpetId,
    notes,
    outcome,
    platform,
    rats: ratsValue,
    system,
  } = fieldValues

  return (
    <>
      {
        !userCanEdit && (
          <div className="store-errors">
            <div className="store-error">
              <span className="detail">{'You do not have permission to edit this rescue. You may only edit rescues you are assigned to.'}</span>
            </div>
          </div>
        )
      }
      {
        (error && !submitting) && (
          <div className="store-errors">
            <div className="store-error">
              <span className="detail">{'Error while submitting paperwork.'}</span>
            </div>
          </div>
        )
      }

      <form
        className={clsx('page-content', { 'loading loader-force': submitting })}
        onSubmit={handleSubmit}>
        <header className="paperwork-header">
          {
            (rescue.attributes.status !== 'closed') && (
              <div className="board-index"><span>{`#${rescue.attributes.commandIdentifier}`}</span></div>
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
          <label htmlFor="client">{'Client CMDR name'}</label>
          <input
            disabled={submitting}
            id="client"
            name="client"
            type="text"
            value={client}
            onChange={handleChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="platform">{'What platform was the rescue on?'}</label>

          <RadioInput
            className="platform"
            disabled={submitting}
            id="platform"
            name="platform"
            options={platformRadioOptions}
            value={platform}
            onChange={handleRadioInputChange} />
          {fieldError('platform')}
        </fieldset>

        {
          platform === 'pc' && (
            <fieldset>
              <label htmlFor="expansion">{'Which game version?'}</label>

              <RadioInput
                className="expansion"
                disabled={submitting}
                id="expansion"
                name="expansion"
                options={expansionLongRadioOptions}
                value={expansion}
                onChange={handleRadioInputChange} />
            </fieldset>
          )
        }

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
            onChange={handleRadioInputChange} />
          {fieldError('outcome')}
        </fieldset>

        <fieldset>
          <label htmlFor="codeRed-yes">{'Was it a code red?'}</label>
          <RadioInput
            className="codeRed"
            disabled={submitting}
            id="codeRed"
            name="codeRed"
            options={codeRedRadioOptions}
            value={String(codeRed)}
            onChange={handleRadioInputChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="carrier-yes">{'Was it a carrier rescue?'}</label>
          <RadioInput
            className="carrier"
            disabled={submitting}
            id="carrier"
            name="carrier"
            options={carrierRadioOptions}
            value={String(carrier)}
            onChange={handleRadioInputChange} />
        </fieldset>

        <fieldset>
          <label htmlFor="rats">{'Who was assigned to this rescue?'}</label>

          <RatTagsInput
            aria-label="Assigned rats"
            data-platform={platform}
            disabled={submitting}
            name="rats"
            value={ratsValue}
            valueProp={getRatTag}
            onChange={handleRatsChange}
            onRemove={handleRatsRemove} />
          {fieldError('rats')}
        </fieldset>

        <fieldset>
          <label htmlFor="firstLimpetId">{'Who fired the first limpet?'}</label>

          <FirstLimpetInput
            data-single
            disabled={submitting || (outcome !== 'success')}
            name="firstLimpetId"
            options={ratsValue}
            value={firstLimpetId}
            valueProp={getRatTag}
            onChange={handleFirstLimpetChange} />
          {fieldError('firstLimpetId')}
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
            onChange={handleSystemChange} />
          {fieldError('system')}
        </fieldset>

        <fieldset>
          <label htmlFor="notes">{'Notes'}</label>

          <textarea
            aria-label="case notes"
            disabled={submitting}
            id="notes"
            name="notes"
            value={notes}
            onChange={handleNotesChange} />
          {fieldError('notes')}
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            {
              errors.form && (
                <div className="invalidity-explainer show">
                  {errors.form}
                </div>
              )
            }
            {
              pwValidity.noChange && (
                <div className="invalidity-explainer show no-change">
                  {'No changes have been made yet!'}
                </div>
              )
            }
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
          <div className="panel-content">
            {
              rescue.attributes.quotes
                ? <ol>{rescue.attributes.quotes.map(renderQuote)}</ol>
                : <span>{'N/A'}</span>
            }
          </div>
        </div>
      </form>
    </>
  )
}

Paperwork.getInitialProps = async (ctx) => {
  const { query, store } = ctx
  const idLower = query.rescueId.toLowerCase()
  if (query.rescueId !== idLower) {
    pageRedirect(ctx, {
      href: '/paperwork/[rescueId]/edit',
      as: `/paperwork/${idLower}/edit`,
    })
  }

  const state = store.getState()

  if (!selectRescueById(state, query)) {
    const response = await store.dispatch(getRescue(query.rescueId))
    const err = getResponseError(response)

    if (err) {
      if (err?.code === HttpStatus.NOT_FOUND) {
        err.detail = 'We tried looking everywhere, but this rescue doesn\'t exist.'
      }
      setError(ctx, err.code, err.detail)
    }
  }
}

Paperwork.getPageMeta = () => {
  return {
    title: 'Paperwork',
  }
}




export default authenticated(Paperwork)
