import clsx from 'clsx'
import { isError } from 'flux-standard-action'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ExpansionRadioInput from '~/components/ExpansionRadioInput'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import { deleteRat, updateRat } from '~/store/actions/rats'
import {
  selectRatById,
  selectUserById,
  selectDisplayRatIdByUserId,
  withCurrentUserId,
  selectRatStatisticsById,
} from '~/store/selectors'
import formatAsEliteDate from '~/util/date/formatAsEliteDate'
import friendlyApiError from '~/util/friendlyApiError'
import getResponseError from '~/util/getResponseError'

import CardControls from '../CardControls'
import InlineEditSpan from '../InlineEditSpan'
import DefaultRatButton from './DefaultRatButton'


function RatCard (props) {
  const { className, ratId } = props

  const dispatch = useDispatch()
  const rat = useSelector((state) => {
    return selectRatById(state, { ratId })
  })
  const statistics = useSelector((state) => {
    return selectRatStatisticsById(state, { ratId })
  })
  const user = useSelector(withCurrentUserId(selectUserById))
  const userDisplayRatId = useSelector(withCurrentUserId(selectDisplayRatIdByUserId))

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [changes, setChanges] = useState({})
  const [validity, setValidity] = useState({ name: false })
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = useCallback(() => {
    setDeleteConfirm(true)
  }, [])

  const handleNameChange = useCallback(({ target: { value } }) => {
    setChanges((prev) => {
      return {
        ...prev,
        name: value === rat.attributes.name ? undefined : value,
      }
    })
    setValidity((prev) => {
      return {
        ...prev,
        name: value && value !== rat.attributes.name,
      }
    })
  }, [rat])

  const handleSubmit = useCallback(async () => {
    if (deleteConfirm) {
      setDeleteConfirm(false)
      setSubmitting('delete')
      dispatch(deleteRat(user, rat))
      return
    }

    setSubmitting(true)
    setError(null)

    const response = await dispatch(updateRat({
      id: rat.id,
      attributes: changes,
    }))

    if (isError(response)) {
      setError(getResponseError(response))
      setSubmitting(false)
      return
    }

    setChanges({})
    setEditing(false)
    setSubmitting(false)
    setValidity({ name: false })
  }, [deleteConfirm, dispatch, user, rat, changes])

  const handleEdit = useCallback(() => {
    setEditing(true)
  }, [])

  const handleCancel = useCallback(() => {
    if (deleteConfirm) {
      setDeleteConfirm(false)
      return
    }
    setEditing(false)
    setChanges({})
    setValidity({ name: false })
    setError(null)
  }, [deleteConfirm])

  const handleDisplayRatClick = useCallback(() => {
    setSubmitting(true)
  }, [])

  const handleDisplayRatUpdate = useCallback((res) => {
    if (!isError(res)) {
      setSubmitting(false)
    }
  }, [])

  const handleExpansionChange = useCallback((event) => {
    return dispatch(updateRat({
      id: rat.id,
      attributes: { expansion: event.target.value },
    }))
  }, [dispatch, rat])

  if (!rat) {
    return null
  }

  const ratIsDisplayRat = userDisplayRatId === rat.id
  const userHasMultipleRats = user.relationships.rats.data.length > 1

  const hasChanges = Object.values(changes).filter((change) => {
    return typeof change !== 'undefined'
  }).length
  const isValid = Object.values(validity).filter(Boolean).length
  const canSubmit = Boolean(hasChanges && isValid)

  const createdAt = formatAsEliteDate(rat.attributes.createdAt)
  const cmdrNameValue = typeof changes.name === 'string' ? changes.name : rat.attributes.name
  const submitText = submitting === 'delete' ? 'Deleting...' : 'Updating...'

  return (
    <div
      className={clsx('panel rat-panel', { editing, submitting }, className)}
      data-loader-text={submitting ? submitText : null}>
      <header>
        <div>
          <span>{'CMDR '}</span>
          <InlineEditSpan
            canEdit={editing}
            inputClassName="dark"
            maxLength={22}
            minLength={1}
            name="name"
            value={cmdrNameValue}
            onChange={handleNameChange} />
        </div>
        <div>
          {
            userHasMultipleRats && (
              <DefaultRatButton
                ratId={rat.id}
                onClick={handleDisplayRatClick}
                onUpdate={handleDisplayRatUpdate} />
            )
          }
          <span className="rat-platform">{rat.attributes.platform.toUpperCase()}</span>
        </div>
      </header>
      {
        error && (
          <ApiErrorBox
            error={error}
            renderError={(err) => {
              return friendlyApiError(err, {
                pointerMessages: {
                  '/data/attributes/name': { detail: err.detail ?? 'CMDR name is invalid.' },
                },
              })
            }} />
        )
      }
      {
        rat.attributes.platform === 'pc' && (
          <div className="panel-content">
            <span>{'Game Version: '}</span>
            <ExpansionRadioInput
              label="Game Version"
              name={`expansion-${rat.id}`}
              value={rat.attributes.expansion}
              onChange={handleExpansionChange} />
          </div>
        )
      }
      <footer className="panel-content">
        <div className="rat-stats">
          <small>
            <span className="text-muted">{'Rescues: '}</span>
            {statistics ? statistics.attributes.firstLimpet : '...'}
          </small>
          <small>
            <span className="text-muted">{'Created: '}</span>
            {createdAt}
          </small>
        </div>
        <CardControls
          canDelete={userHasMultipleRats && !ratIsDisplayRat && (statistics && !statistics?.attributes.firstLimpet)}
          canSubmit={canSubmit}
          controlType="rat"
          deleteMode={deleteConfirm}
          editMode={editing}
          onCancelClick={handleCancel}
          onDeleteClick={handleDelete}
          onEditClick={handleEdit}
          onSubmitClick={handleSubmit} />
      </footer>
    </div>
  )
}

RatCard.propTypes = {
  className: PropTypes.string,
  ratId: PropTypes.string.isRequired,
}


export default RatCard
