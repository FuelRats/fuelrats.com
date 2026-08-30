import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import asModal, { ModalContent, ModalFooter, FooterPrimary } from '~/components/asModal'
import { createGroup } from '~/store/actions/groups'
import getResponseError from '~/util/getResponseError'

import styles from './GroupAdmin.module.scss'





const NAME_PATTERN = /^[a-zA-Z0-9]+$/u


function CreateGroupModal ({ onClose, onCreated }) {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const valid = NAME_PATTERN.test(name)

  const handleNameChange = useCallback((event) => {
    setName(event.target.value)
  }, [])

  const handleCreate = useCallback(async () => {
    setSaving(true)
    setError(null)
    const response = await dispatch(createGroup({ attributes: { name } }))
    const err = getResponseError(response)
    setSaving(false)
    if (err) {
      setError(err.detail ?? 'Failed to create group.')
      return
    }
    // 201 carries the server-generated UUID — hand it back so the caller opens the editor on it.
    onCreated(response.payload?.data?.id)
  }, [dispatch, name, onCreated])

  return (
    <>
      <ModalContent>
        <label className={styles.flagCheck}>
          {'Group name'}
          <input
            aria-label="New group name"
            placeholder="alphanumeric"
            type="text"
            value={name}
            onChange={handleNameChange} />
        </label>
        {
          !valid && name.length > 0 && (
            <p className={styles.error}>{'Name must be alphanumeric.'}</p>
          )
        }
        {Boolean(error) && (<p className={styles.error}>{error}</p>)}
        <p className={styles.sectionHint}>
          {'Channels and permissions are added after the group is created.'}
        </p>
      </ModalContent>
      <ModalFooter>
        <FooterPrimary>
          <button
            className="green"
            disabled={!valid || saving}
            type="button"
            onClick={handleCreate}>
            {saving ? 'Creating...' : 'Create group'}
          </button>
          <button type="button" onClick={onClose}>
            {'Cancel'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </>
  )
}

CreateGroupModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
}





export default asModal({ title: 'New group' })(CreateGroupModal)
