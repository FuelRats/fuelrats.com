import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HttpStatus } from '@fuelrats/web-util/http'
import clsx from 'clsx'
import Link from 'next/link'
import Router from 'next/router'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import { deleteRescue, getRescue } from '~/store/actions/rescues'
import {
  selectRatsByRescueId,
  selectRescueById,
  selectCurrentUserCanEditRescue,
  selectCurrentUserHasScope,
} from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import { expansionLongNameMap } from '~/util/expansion'
import pageRedirect from '~/util/getInitialProps/pageRedirect'
import setError from '~/util/getInitialProps/setError'
import getResponseError from '~/util/getResponseError'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'




function renderQuote (quote) {
  const createdAt = formatAsEliteDateTime(quote.createdAt)
  const updatedAt = formatAsEliteDateTime(quote.updatedAt)
  return (
    <li key={quote.createdAt}>
      <div className="times">
        <div className="created" title="Created at">{createdAt}</div>
        {
          (updatedAt !== createdAt) && (
            <div className="updated" title="Updated at">
              <span className="label">{'Updated at '}</span>
              {updatedAt}
            </div>
          )
        }
      </div>
      <span className="message">{quote.message}</span>
      <div className="authors">
        <div className="author" title="Created by">{quote.author}</div>
        {
          (quote.author !== quote.lastAuthor) && (
            <div className="last-author" title="Last updated by">
              <span className="label">{'Updated by '}</span>
              {quote.lastAuthor}
            </div>
          )
        }
      </div>
    </li>
  )
}


function Paperwork ({ query }) {
  const dispatch = useDispatch()
  const rats = useSelector((state) => {
    return selectRatsByRescueId(state, query)
  }) ?? []
  const rescue = useSelector((state) => {
    return selectRescueById(state, query)
  })
  const userCanEdit = useSelector((state) => {
    return selectCurrentUserCanEditRescue(state, query)
  })
  const userCanWriteAll = useSelector((state) => {
    return selectCurrentUserHasScope(state, { scope: 'rescues.write' })
  })

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = useCallback(async () => {
    if (deleteConfirm) {
      setDeleting(true)
      await dispatch(deleteRescue(rescue))
      Router.push(userCanWriteAll ? '/admin/rescues' : '/')
      return
    }
    setDeleteConfirm(true)
  }, [deleteConfirm, dispatch, rescue, userCanWriteAll])

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm(false)
  }, [])

  const renderRat = useCallback((rat) => {
    return (
      <li key={rat.id} className="first-limpet">
        {rat.attributes.name}
        {
          (rat.id === rescue.relationships.firstLimpet?.data?.id) && (
            <span className="badge first-limpet">{'1st'}</span>
          )
        }
      </li>
    )
  }, [rescue])

  const renderRats = () => {
    return (
      <ul>
        {rats.map(renderRat)}
        {
          rescue.attributes.unidentifiedRats.map((rat) => {
            return <li key={rat} className="unidentified">{rat}<span className="badge">{'UnID'}</span></li>
          })
        }
      </ul>
    )
  }

  const renderQuotes = () => {
    if (rescue.attributes.quotes) {
      return (
        <ol>
          {rescue.attributes.quotes.map(renderQuote)}
        </ol>
      )
    }
    return (<span>{'N/A'}</span>)
  }

  // This makes 2 new variables called status and outcome, and sets them to the values of the outcome and status in the rescue object.
  let { status, outcome } = rescue.attributes

  if (status === 'inactive') {
    status = 'open'
    outcome = 'inactive'
  } else if (status === 'open') {
    outcome = 'active'
  }

  return (
    <div className="page-content">
      <menu type="toolbar">
        <div className="primary">
          {
            deleteConfirm && (
              <>
                {
                  deleting
                    ? (
                      <span>{'Deleting... '}<FontAwesomeIcon fixedWidth pulse icon="spinner" /> </span>
                    )
                    : (
                      <span>{'Delete this rescue? (This cannot be undone!) '}</span>
                    )
                }

                <button
                  className="compact"
                  disabled={deleting}
                  type="button"
                  onClick={handleDeleteClick}>
                  {'Yes'}
                </button>

                <button
                  className="compact"
                  disabled={deleting}
                  type="button"
                  onClick={handleDeleteCancel}>
                  {'No'}
                </button>
              </>
            )
          }

          {
            !deleteConfirm && (
              <>
                <Link
                  aria-disabled={!userCanEdit}
                  className={clsx('button compact', { disabled: !userCanEdit })}
                  href={userCanEdit ? makePaperworkRoute({ rescueId: rescue.id, edit: true }) : '#'}
                  title={!userCanEdit ? 'You do not have permission to edit this rescue' : undefined}
                  onClick={!userCanEdit ? (event) => { return event.preventDefault() } : undefined}>
                  {'Edit'}
                </Link>
                <button
                  className="compact"
                  disabled={!userCanWriteAll}
                  title={!userCanWriteAll ? 'You do not have permission to delete rescues' : undefined}
                  type="button"
                  onClick={handleDeleteClick}>
                  {'Delete'}
                </button>
              </>
            )
          }
        </div>

        <div className="secondary">
          {
            query.from === 'profile' && (
              <Link className="button compact" href="/profile/rescues">
                <FontAwesomeIcon fixedWidth icon="arrow-left" />
                {' Back to Profile'}
              </Link>
            )
          }
        </div>
      </menu>

      <header className="paperwork-header">
        {
          (rescue.attributes.status !== 'closed') && (typeof rescue.attributes.commandIdentifier === 'number') && (
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
                <span className="system">{(rescue.attributes.system) || ('Unknown')}</span>
              </span>
            )
          }
          {
            (rescue.attributes.title) && (
              <span>
                {'Operation '}
                <span className="rescue-title">{rescue.attributes.title}</span>
              </span>
            )
          }
        </div>
      </header>

      <div className="rescue-tags">
        <div className="tag status-group">
          <span className={clsx('status', status)}>{status}</span>
          <span className="outcome">{outcome || 'unfiled'}</span>
        </div>

        <div className={clsx('tag platform', rescue.attributes.platform ?? 'none')}>
          {rescue.attributes.platform || 'No Platform'}
        </div>

        {
          rescue.attributes.platform === 'pc' && rescue.attributes.expansion && (
            <div className="tag">
              {expansionLongNameMap[rescue.attributes.expansion] ?? rescue.attributes.expansion}
            </div>
          )
        }

        {
          (rescue.attributes.codeRed) && (
            <div className="tag code-red">{'CR'}</div>
          )
        }

        {
          (rescue.attributes.carrier) && (
            <div className="tag">{'Carrier'}</div>
          )
        }

        {
          rescue.attributes.outcome === 'purge' && (
            <div className="md-group">
              <div className="marked-for-deletion">{'Marked for Deletion'}</div>
              <div className="md-reason">
                {`"${rescue.attributes.notes}"`}
              </div>
            </div>
          )
        }
      </div>

      <div className="info">
        <span className="label">{'Client '}</span>
        <span className="cmdr-name">{rescue.attributes.client}</span>
        <span className="label">{'System '}</span>
        <span className="system">{rescue.attributes.system || 'Unknown'}</span>
        <span className="label">{'Created'}</span>
        <span className="date-created content">{formatAsEliteDateTime(rescue.attributes.createdAt)}</span>
        <span className="label">{'Updated'}</span>
        <span className="date-updated content">{formatAsEliteDateTime(rescue.attributes.updatedAt)}</span>
        <span className="label">{'IRC Nick'}</span>
        <span className="irc-nick content">{rescue.attributes.clientNick}</span>
        <span className="label">{'Language'}</span>
        <span className="language content">{rescue.attributes.clientLanguage}</span>
      </div>

      <div className="panel rats">
        <header>{'Rats'}</header>
        <div className="panel-content">{renderRats()}</div>
      </div>

      <div className="panel quotes">
        <header>{'Quotes'}</header>
        <div className="panel-content">{renderQuotes()}</div>
      </div>

      {
        rescue.attributes.outcome !== 'purge' && (
          <div className="panel notes">
            <header>{'Notes'}</header>
            <div className="panel-content">{rescue.attributes.notes}</div>
          </div>
        )
      }
    </div>
  )
}

Paperwork.getInitialProps = async (ctx) => {
  const { query, store } = ctx
  const idLower = query.rescueId.toLowerCase()
  if (query.rescueId !== idLower) {
    pageRedirect(ctx, {
      href: '/paperwork/[rescueId]',
      as: `/paperwork/${idLower}`,
    })
  }

  const state = store.getState()

  if (!selectRescueById(state, query)) {
    const response = await store.dispatch(getRescue(query.rescueId))
    const error = getResponseError(response)
    if (error) {
      setError(ctx, HttpStatus.NOT_FOUND, 'We tried looking everywhere, but this rescue doesn\'t exist.')
    }
  }
}

Paperwork.getPageMeta = () => {
  return {
    title: 'Paperwork',
  }
}




export default authenticated(Paperwork)
