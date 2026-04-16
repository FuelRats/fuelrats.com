import { HttpStatus } from '@fuelrats/web-util/http'
import clsx from 'clsx'
import { isError } from 'flux-standard-action'
import Router from 'next/router'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'

import { authenticated } from '~/components/AppLayout'
import useUnsavedChangesGuard from '~/hooks/useUnsavedChangesGuard'
import { getRescue, updateRescue } from '~/store/actions/rescues'
import {
  selectRatsByRescueId,
  selectRescueById,
  selectCurrentUserCanEditRescue,
} from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import pageRedirect from '~/util/getInitialProps/pageRedirect'
import setError from '~/util/getInitialProps/setError'
import getResponseError from '~/util/getResponseError'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'

import PaperworkFormFields from './PaperworkFormFields'
import usePaperworkChanges from './usePaperworkChanges'




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




function Paperwork ({ query }) {
  const dispatch = useDispatch()
  const rats = useSelector((state) => {
    return selectFormattedRatsByRescueId(state, query)
  })
  const rescue = useSelector((state) => {
    return selectRescueById(state, query)
  })
  const userCanEdit = useSelector((state) => {
    return selectCurrentUserCanEditRescue(state, query)
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setErrorState] = useState(null)

  const {
    changes,
    fieldValues,
    validity,
    hasUnsavedChanges,
    handlers,
  } = usePaperworkChanges(rescue, rats, userCanEdit)

  useUnsavedChangesGuard(hasUnsavedChanges, { isSubmitting: submitting })

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

  const { errors = {} } = validity

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

        <PaperworkFormFields
          errors={errors}
          fieldValues={fieldValues}
          handlers={handlers}
          submitting={submitting} />

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
              validity.noChange && (
                <div className="invalidity-explainer show no-change">
                  {'No changes have been made yet!'}
                </div>
              )
            }
            <button
              className="green"
              disabled={submitting || !validity.valid}
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
