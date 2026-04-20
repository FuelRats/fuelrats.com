import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import asModal, { ModalContent, ModalFooter, FooterPrimary } from '~/components/asModal'
import ConfirmActionButton from '~/components/ConfirmActionButton'
import PlatformBadge from '~/components/PlatformBadge'
import RatTagsInput from '~/components/RatTagsInput'
import { deleteRat, updateRat, reassignRat, transferRescues } from '~/store/actions/rats'
import { addNickname, deleteNickname, setDisplayNickname } from '~/store/actions/user'
import { selectRatsByUserId, selectNicknamesByUserId } from '~/store/selectors'
import getRatTag from '~/util/getRatTag'
import getResponseError from '~/util/getResponseError'

import styles from '../../pages/admin/users/AdminUsers.module.scss'


const PERMANENT_SUSPENSION_DATE = '3000-01-01T00:00:00Z'

const PLATFORM_OPTIONS = ['pc', 'xb', 'ps']
const EXPANSION_OPTIONS = [
  { value: 'horizons3', label: 'Legacy' },
  { value: 'horizons4', label: 'Horizons' },
  { value: 'odyssey', label: 'Odyssey' },
]


function SuspendModalContent ({ onClose, userId, onSave }) {
  const [suspendDate, setSuspendDate] = useState('')
  const [permanent, setPermanent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setError(null)
    const suspendedValue = permanent
      ? PERMANENT_SUSPENSION_DATE
      : `${suspendDate}T23:59:59Z`
    const err = await onSave(userId, { suspended: suspendedValue })
    if (err) {
      setError(err)
      setSubmitting(false)
    } else {
      onClose()
    }
  }, [userId, suspendDate, permanent, onSave, onClose])

  return (
    <>
      <ModalContent>
        {error && (<div className={styles.modalError}>{error}</div>)}
        <div className={styles.modalField}>
          <label>
            {'Suspend until'}
            <input
              aria-label="Suspension date"
              className={styles.dateInput}
              disabled={permanent}
              type="date"
              value={suspendDate}
              onChange={
                (event) => {
                  return setSuspendDate(event.target.value)
                }
              } />
          </label>
        </div>
        <label className={styles.permCheck}>
          <input
            aria-label="Permanent suspension"
            checked={permanent}
            type="checkbox"
            onChange={
              (event) => {
                return setPermanent(event.target.checked)
              }
            } />
          {'Permanent'}
        </label>
      </ModalContent>
      <ModalFooter>
        <FooterPrimary>
          <button
            disabled={submitting || (!suspendDate && !permanent)}
            type="button"
            onClick={handleSubmit}>
            {submitting ? 'Suspending...' : 'Suspend'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </>
  )
}

const SuspendModal = asModal({ title: 'Suspend User' })(SuspendModalContent)


function ResetPasswordModalContent ({ onClose, userId, onSave }) {
  const [newPassword, setNewPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = useCallback(async () => {
    if (!newPassword.trim()) {
      return
    }
    setSubmitting(true)
    setError(null)
    const err = await onSave(userId, newPassword.trim())
    if (err) {
      setError(err)
      setSubmitting(false)
    } else {
      onClose()
    }
  }, [userId, newPassword, onSave, onClose])

  return (
    <>
      <ModalContent>
        {error && (<div className={styles.modalError}>{error}</div>)}
        <div className={styles.modalField}>
          <label>
            {'New Password'}
            <input
              aria-label="New password"
              placeholder="Enter new password..."
              type="text"
              value={newPassword}
              onChange={
                (event) => {
                  return setNewPassword(event.target.value)
                }
              } />
          </label>
        </div>
      </ModalContent>
      <ModalFooter>
        <FooterPrimary>
          <button
            disabled={submitting || !newPassword.trim()}
            type="button"
            onClick={handleSubmit}>
            {submitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </>
  )
}

const ResetPasswordModal = asModal({ title: 'Reset Password' })(ResetPasswordModalContent)


function RatEditRow ({ rat, userId, onRefresh }) {
  const dispatch = useDispatch()
  const [name, setName] = useState(rat.attributes.name)
  const [platform, setPlatform] = useState(rat.attributes.platform ?? '')
  const [expansion, setExpansion] = useState(rat.attributes.expansion ?? '')
  const [reassignTo, setReassignTo] = useState('')
  const [transferTo, setTransferTo] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isDirty = name !== rat.attributes.name
    || platform !== (rat.attributes.platform ?? '')
    || expansion !== (rat.attributes.expansion ?? '')

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    const attrs = {}
    if (name !== rat.attributes.name) {
      attrs.name = name
    }
    if (platform !== (rat.attributes.platform ?? '')) {
      attrs.platform = platform || null
    }
    if (expansion !== (rat.attributes.expansion ?? '')) {
      attrs.expansion = expansion || null
    }
    const response = await dispatch(updateRat({ id: rat.id, attributes: attrs }))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to update rat.')
    }
    setSaving(false)
    onRefresh?.()
  }, [dispatch, rat, name, platform, expansion, onRefresh])

  const handleDelete = useCallback(async () => {
    setError(null)
    const response = await dispatch(deleteRat({ id: userId }, rat))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to delete rat.')
    }
    onRefresh?.()
    return true
  }, [dispatch, rat, userId, onRefresh])

  const handleReassign = useCallback(async () => {
    if (!reassignTo.trim()) {
      return true
    }
    setError(null)
    const response = await dispatch(reassignRat(rat.id, reassignTo.trim()))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to reassign rat.')
    } else {
      setReassignTo('')
    }
    onRefresh?.()
    return true
  }, [dispatch, rat.id, reassignTo, onRefresh])

  const handleTransferChange = useCallback((rats) => {
    setTransferTo(rats?.[0] ?? null)
  }, [])

  const handleTransfer = useCallback(async () => {
    if (!transferTo) {
      return true
    }
    setError(null)
    const response = await dispatch(transferRescues(rat.id, transferTo.id))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to transfer rescues.')
    } else {
      setTransferTo(null)
    }
    onRefresh?.()
    return true
  }, [dispatch, rat.id, transferTo, onRefresh])

  return (
    <div className={styles.ratEditRow}>
      {error && (<div className={styles.ratEditError}>{error}</div>)}
      <div className={styles.ratEditFields}>
        <PlatformBadge className={styles.ratEditBadge} expansion={rat.attributes.expansion} platform={rat.attributes.platform} />
        <input
          aria-label="Rat name"
          className={styles.ratEditInput}
          placeholder="Name"
          type="text"
          value={name}
          onChange={
            (event) => {
              return setName(event.target.value)
            }
          } />
        <select
          aria-label="Platform"
          className={styles.ratEditSelect}
          value={platform}
          onChange={
            (event) => {
              return setPlatform(event.target.value)
            }
          }>
          <option value="">{'—'}</option>
          {
            PLATFORM_OPTIONS.map((plat) => {
              return <option key={plat} value={plat}>{plat.toUpperCase()}</option>
            })
          }
        </select>
        <select
          aria-label="Expansion"
          className={styles.ratEditSelect}
          value={expansion}
          onChange={
            (event) => {
              return setExpansion(event.target.value)
            }
          }>
          <option value="">{'—'}</option>
          {
            EXPANSION_OPTIONS.map((exp) => {
              return <option key={exp.value} value={exp.value}>{exp.label}</option>
            })
          }
        </select>
        {
          isDirty && (
            <button
              className="compact"
              disabled={saving}
              type="button"
              onClick={handleSave}>
              <FontAwesomeIcon fixedWidth icon="check" />
            </button>
          )
        }
      </div>
      <div className={styles.ratEditActions}>
        <div className={styles.ratReassign}>
          <input
            aria-label="Reassign to user ID"
            className={styles.ratEditInput}
            placeholder="Reassign to user ID..."
            type="text"
            value={reassignTo}
            onChange={
              (event) => {
                return setReassignTo(event.target.value)
              }
            } />
          <ConfirmActionButton
            className="compact secondary"
            confirmButtonText="Reassign"
            confirmSubText="Reassign this rat?"
            denyButtonText="Cancel"
            disabled={!reassignTo.trim()}
            name={rat.id}
            onConfirm={handleReassign}
            onConfirmText="">
            <FontAwesomeIcon fixedWidth icon="arrow-right" />
          </ConfirmActionButton>
        </div>
        <div className={styles.ratTransfer}>
          <RatTagsInput
            data-single
            aria-label="Transfer rescues to rat"
            placeholder="Transfer rescues to..."
            value={transferTo ? [transferTo] : []}
            valueProp={getRatTag}
            onChange={handleTransferChange} />
          <ConfirmActionButton
            className="compact secondary"
            confirmButtonText="Transfer"
            confirmSubText="Transfer all rescues to this rat?"
            denyButtonText="Cancel"
            disabled={!transferTo}
            name={`${rat.id}-transfer`}
            onConfirm={handleTransfer}
            onConfirmText="">
            <FontAwesomeIcon fixedWidth icon="arrows-rotate" />
          </ConfirmActionButton>
        </div>
        <ConfirmActionButton
          className="compact secondary"
          confirmButtonText="Delete"
          confirmSubText={`Delete ${rat.attributes.name}?`}
          denyButtonText="Cancel"
          name={rat.id}
          onConfirm={handleDelete}
          onConfirmText="">
          <FontAwesomeIcon fixedWidth icon="trash" />
        </ConfirmActionButton>
      </div>
    </div>
  )
}


function EditRatsModalContent ({ userId, onRefresh }) {
  const rats = useSelector((state) => {
    return selectRatsByUserId(state, { userId })
  })

  return (
    <ModalContent>
      {
        (!rats || rats.length === 0) && (
          <div className={styles.muted}>{'No rats'}</div>
        )
      }
      {
        rats?.map((rat) => {
          return (
            <RatEditRow
              key={rat.id}
              rat={rat}
              userId={userId}
              onRefresh={onRefresh} />
          )
        })
      }
    </ModalContent>
  )
}

const EditRatsModal = asModal({ title: 'Edit Rats' })(EditRatsModalContent)


function EditNicksModalContent ({ userId, onRefresh }) {
  const dispatch = useDispatch()
  const nicks = useSelector((state) => {
    return selectNicknamesByUserId(state, { userId })
  })
  const [error, setError] = useState(null)
  const [newNick, setNewNick] = useState('')
  const [adding, setAdding] = useState(false)

  const filtered = nicks?.filter(Boolean) ?? []
  const displayNick = filtered.find((nick) => {
    return nick.attributes?.nick === nick.attributes?.display
  })

  const handleSetPrimary = useCallback(async (nick) => {
    setError(null)
    const response = await dispatch(setDisplayNickname(nick.id, nick.attributes.nick))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to set primary nick.')
    }
    onRefresh?.()
    return true
  }, [dispatch, onRefresh])

  const handleDelete = useCallback(async (nick) => {
    setError(null)
    const response = await dispatch(deleteNickname({ type: 'users', id: userId }, nick))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to delete nick.')
    }
    onRefresh?.()
    return true
  }, [dispatch, userId, onRefresh])

  const handleAddNick = useCallback(async () => {
    if (!newNick.trim()) {
      return
    }
    setAdding(true)
    setError(null)
    const response = await dispatch(addNickname(
      { type: 'users', id: userId },
      { nick: newNick.trim(), userId },
    ))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to add nick.')
    } else {
      setNewNick('')
    }
    setAdding(false)
    onRefresh?.()
  }, [dispatch, userId, newNick, onRefresh])

  return (
    <ModalContent>
      {error && (<div className={styles.modalError}>{error}</div>)}
      {
        filtered.length === 0 && (
          <div className={styles.muted}>{'No IRC nicknames'}</div>
        )
      }
      {
        filtered.map((nick) => {
          const isPrimary = displayNick?.id === nick.id
          return (
            <div key={nick.id} className={styles.nickEditRow}>
              <span className={styles.nickName}>
                {nick.attributes?.nick}
                {isPrimary && (<span className={styles.primaryBadge}>{'primary'}</span>)}
              </span>
              <div className={styles.nickActions}>
                {
                  !isPrimary && (
                    <ConfirmActionButton
                      className="compact secondary"
                      confirmButtonText="Set Primary"
                      confirmSubText={`Make ${nick.attributes?.nick} primary?`}
                      denyButtonText="Cancel"
                      name={nick.id}
                      onConfirm={
                        () => {
                          return handleSetPrimary(nick)
                        }
                      }
                      onConfirmText="">
                      <FontAwesomeIcon fixedWidth icon="star" />
                    </ConfirmActionButton>
                  )
                }
                <ConfirmActionButton
                  className="compact secondary"
                  confirmButtonText="Delete"
                  confirmSubText={`Delete ${nick.attributes?.nick}?`}
                  denyButtonText="Cancel"
                  name={nick.id}
                  onConfirm={
                    () => {
                      return handleDelete(nick)
                    }
                  }
                  onConfirmText="">
                  <FontAwesomeIcon fixedWidth icon="trash" />
                </ConfirmActionButton>
              </div>
            </div>
          )
        })
      }
      <div className={styles.addNickRow}>
        <input
          aria-label="New nickname"
          className={styles.ratEditInput}
          disabled={adding}
          placeholder="Add nickname..."
          type="text"
          value={newNick}
          onChange={
            (event) => {
              return setNewNick(event.target.value)
            }
          }
          onKeyDown={
            (event) => {
              if (event.key === 'Enter') {
                handleAddNick()
              }
            }
          } />
        <button
          className="compact"
          disabled={adding || !newNick.trim()}
          type="button"
          onClick={handleAddNick}>
          <FontAwesomeIcon fixedWidth icon="plus" />
        </button>
      </div>
    </ModalContent>
  )
}

const EditNicksModal = asModal({ title: 'Edit IRC Nicknames' })(EditNicksModalContent)


export { SuspendModal, ResetPasswordModal, EditRatsModal, EditNicksModal }
