import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import asModal, { ModalContent, ModalFooter, FooterPrimary, FooterSecondary } from '~/components/asModal'
import { updateGroup, deleteGroup } from '~/store/actions/groups'
import { selectGroupById } from '~/store/selectors'
import getResponseError from '~/util/getResponseError'

import ConfirmActionButton from '../ConfirmActionButton'
import styles from './GroupAdmin.module.scss'
import GroupChannelsSection from './GroupChannelsSection'
import GroupPermissionsSection from './GroupPermissionsSection'
import ApiErrorBox from '../MessageBox/ApiErrorBox'





const NAME_PATTERN = /^[a-zA-Z0-9]+$/u


function GroupScalarsSection ({ group }) {
  const dispatch = useDispatch()
  const { attributes } = group

  const [form, setForm] = useState({
    name: attributes.name ?? '',
    displayName: attributes.displayName ?? '',
    vhost: attributes.vhost ?? '',
    priority: attributes.priority ?? 0,
    withoutPrefix: attributes.withoutPrefix ?? false,
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const setField = useCallback((key, value) => {
    setSaved(false)
    setForm((prev) => {
      return { ...prev, [key]: value }
    })
  }, [])

  const handleNameChange = useCallback((event) => {
    setField('name', event.target.value)
  }, [setField])

  const handleDisplayNameChange = useCallback((event) => {
    setField('displayName', event.target.value)
  }, [setField])

  const handleVhostChange = useCallback((event) => {
    setField('vhost', event.target.value)
  }, [setField])

  const handlePriorityChange = useCallback((event) => {
    setField('priority', event.target.value)
  }, [setField])

  const handleWithoutPrefixChange = useCallback((event) => {
    setField('withoutPrefix', event.target.checked)
  }, [setField])

  // Only attributes that actually changed, so an unrelated tweak never re-fans-out vhost.
  const changedAttributes = useMemo(() => {
    const changed = {}
    if (form.name !== (attributes.name ?? '')) {
      changed.name = form.name
    }
    if (form.displayName !== (attributes.displayName ?? '')) {
      changed.displayName = form.displayName
    }
    if (form.vhost !== (attributes.vhost ?? '')) {
      changed.vhost = form.vhost
    }
    if (Number(form.priority) !== (attributes.priority ?? 0)) {
      changed.priority = Number(form.priority)
    }
    if (form.withoutPrefix !== (attributes.withoutPrefix ?? false)) {
      changed.withoutPrefix = form.withoutPrefix
    }
    return changed
  }, [form, attributes])

  const nameValid = NAME_PATTERN.test(form.name)
  const dirty = Object.keys(changedAttributes).length > 0

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    const response = await dispatch(updateGroup({ id: group.id, ...changedAttributes }))
    const err = getResponseError(response)
    setSaving(false)
    if (err) {
      setError(err)
    } else {
      setSaved(true)
    }
  }, [dispatch, group.id, changedAttributes])

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{'Details'}</h3>

      <ApiErrorBox error={error} />

      <div className={styles.scalarGrid}>
        <label>
          {'Name'}
          <input
            aria-label="Group name"
            type="text"
            value={form.name}
            onChange={handleNameChange} />
        </label>
        <label>
          {'Display name'}
          <input
            aria-label="Group display name"
            type="text"
            value={form.displayName}
            onChange={handleDisplayNameChange} />
        </label>
        <label>
          {'vHost'}
          <input
            aria-label="Group vhost"
            placeholder="example.fuelrats.com"
            type="text"
            value={form.vhost}
            onChange={handleVhostChange} />
        </label>
        <label>
          {'Priority'}
          <input
            aria-label="Group priority"
            type="number"
            value={form.priority}
            onChange={handlePriorityChange} />
        </label>
      </div>

      <label className={styles.switchRow}>
        <input
          aria-label="Apply vhost without rat-name prefix"
          checked={form.withoutPrefix}
          type="checkbox"
          onChange={handleWithoutPrefixChange} />
        {'Apply vHost without rat-name prefix'}
      </label>

      <p className={styles.sectionHint}>
        {'Renaming a group can orphan external references (vHost masks, IRC configs). '}
        {'Changing the vHost or prefix re-applies host masks to every member.'}
      </p>

      <div className={styles.pickerActions}>
        <button
          className="green compact"
          disabled={!dirty || saving || !nameValid}
          type="button"
          onClick={handleSave}>
          {saving ? 'Saving...' : 'Save details'}
        </button>
        {!nameValid && (<span className={styles.error}>{'Name must be alphanumeric.'}</span>)}
        {saved && (<span className={styles.savedNote}>{'Saved.'}</span>)}
      </div>
    </section>
  )
}

GroupScalarsSection.propTypes = {
  group: PropTypes.object.isRequired,
}





function GroupEditModal ({ groupId, onClose }) {
  const dispatch = useDispatch()
  const group = useSelector((state) => {
    return selectGroupById(state, { groupId })
  })
  const [deleteError, setDeleteError] = useState(null)

  const handleDelete = useCallback(async () => {
    const response = await dispatch(deleteGroup(group))
    const err = getResponseError(response)
    if (err) {
      setDeleteError(err.detail ?? 'Failed to delete group.')
      return true
    }
    onClose()
    return true
  }, [dispatch, group, onClose])

  if (!group) {
    return (
      <ModalContent>
        <p>{'Group not found.'}</p>
      </ModalContent>
    )
  }

  return (
    <>
      <ModalContent>
        <GroupScalarsSection group={group} />
        <GroupChannelsSection group={group} />
        <GroupPermissionsSection group={group} />
        {Boolean(deleteError) && (<p className={styles.error}>{deleteError}</p>)}
      </ModalContent>
      <ModalFooter>
        <FooterSecondary>
          <ConfirmActionButton
            confirmButtonText="Delete group"
            confirmSubText="Delete this group and revoke it from all members?"
            onConfirm={handleDelete}>
            {'Delete group'}
          </ConfirmActionButton>
        </FooterSecondary>
        <FooterPrimary>
          <button type="button" onClick={onClose}>
            {'Close'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </>
  )
}

GroupEditModal.propTypes = {
  groupId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
}





export default asModal({ className: 'group-edit-modal' })(GroupEditModal)
