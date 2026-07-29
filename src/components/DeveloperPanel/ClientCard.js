import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import asModal, { ModalContent, ModalFooter, FooterPrimary } from '~/components/asModal'
import ConfirmActionButton from '~/components/ConfirmActionButton'
import CopyToClipboard from '~/components/CopyToClipboard'
import { regenerateSecret, revokeClientTokens, updateClient } from '~/store/actions/clients'
import getResponseError from '~/util/getResponseError'

import styles from './DeveloperPanel.module.scss'


function SecretModal ({ onClose }) {
  return (
    <ModalContent>
      <div className={styles.resultPanel}>
        <div className={styles.resultField}>
          <span className={styles.resultLabel}>{'New Client Secret'}</span>
          <CopyToClipboard doHint className={styles.resultValue} text={SecretModal.secret ?? ''}>
            <code>{SecretModal.secret}</code>
          </CopyToClipboard>
        </div>
        <p className={styles.secretWarning}>
          <FontAwesomeIcon icon="exclamation-triangle" />
          {' Save your client secret now. You will not be able to see it again.'}
        </p>
      </div>
      <ModalFooter>
        <FooterPrimary>
          <button className="green" type="button" onClick={onClose}>{'Done'}</button>
        </FooterPrimary>
      </ModalFooter>
    </ModalContent>
  )
}

const SecretModalWrapped = asModal({
  className: 'login-dialog',
  title: 'Secret Regenerated',
})(SecretModal)


function ClientCard ({
  client, onDelete, showNamespaces, showFirstParty, isAdmin,
}) {
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(client.attributes.name)
  const [redirectUri, setRedirectUri] = useState(client.attributes.redirectUri ?? '')
  const [namespaces, setNamespaces] = useState(client.attributes.namespaces?.join(', ') ?? '')
  const [firstParty, setFirstParty] = useState(client.attributes.firstParty ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showSecretModal, setShowSecretModal] = useState(false)

  const handleRegenerateSecret = useCallback(async () => {
    setError(null)
    const response = await dispatch(regenerateSecret(client.id))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to regenerate secret.')
      return true
    }
    SecretModal.secret = response.payload?.secret
    setShowSecretModal(true)
    return true
  }, [dispatch, client.id])

  const handleRevokeTokens = useCallback(async () => {
    setError(null)
    const response = await dispatch(revokeClientTokens(client.id))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to revoke tokens.')
    }
    return true
  }, [dispatch, client.id])

  const handleEdit = useCallback(() => {
    setEditing(true)
    setError(null)
  }, [])

  const handleCancel = useCallback(() => {
    setEditing(false)
    setName(client.attributes.name)
    setRedirectUri(client.attributes.redirectUri ?? '')
    setNamespaces(client.attributes.namespaces?.join(', ') ?? '')
    setFirstParty(client.attributes.firstParty ?? false)
    setError(null)
  }, [client.attributes.name, client.attributes.redirectUri, client.attributes.namespaces, client.attributes.firstParty])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    const attrs = {
      name,
      redirectUri: redirectUri || undefined,
    }
    if (isAdmin) {
      attrs.namespaces = namespaces.split(',').map((ns) => {
        return ns.trim()
      }).filter(Boolean)
      attrs.firstParty = firstParty
    }
    const response = await dispatch(updateClient(client.id, attrs))
    const err = getResponseError(response)
    if (err) {
      setError(err.detail ?? 'Failed to update client.')
      setSaving(false)
      return
    }
    setSaving(false)
    setEditing(false)
  }, [dispatch, client.id, name, redirectUri, isAdmin, namespaces, firstParty])

  if (editing) {
    return (
      <tr>
        <td>
          <input
            aria-label="Client name"
            className={styles.editInput}
            disabled={saving}
            type="text"
            value={name}
            onChange={
              (event) => {
                return setName(event.target.value)
              }
            } />
        </td>
        <td className={styles.idCell}>
          <code>{client.id}</code>
        </td>
        <td>
          <input
            aria-label="Redirect URI"
            className={styles.editInput}
            disabled={saving}
            placeholder="https://..."
            type="url"
            value={redirectUri}
            onChange={
              (event) => {
                return setRedirectUri(event.target.value)
              }
            } />
          {error && (<div className={styles.error}>{error}</div>)}
        </td>
        {
          showNamespaces && (
            <td>
              {
                isAdmin
                  ? (
                    <input
                      aria-label="Namespaces"
                      className={styles.editInput}
                      disabled={saving}
                      placeholder="ns1, ns2"
                      type="text"
                      value={namespaces}
                      onChange={
                        (event) => {
                          return setNamespaces(event.target.value)
                        }
                      } />
                  )
                  : (client.attributes.namespaces?.join(', ') ?? '-')
              }
            </td>
          )
        }
        {
          showFirstParty && (
            <td>
              {
                isAdmin
                  ? (
                    <input
                      aria-label="First party"
                      checked={firstParty}
                      disabled={saving}
                      type="checkbox"
                      onChange={
                        (event) => {
                          return setFirstParty(event.target.checked)
                        }
                      } />
                  )
                  : (client.attributes.firstParty && (<FontAwesomeIcon className={styles.firstPartyIcon} icon="circle-check" />))
              }
            </td>
          )
        }
        <td className={styles.actionsCell}>
          <button
            className="compact green"
            disabled={saving || !name.trim()}
            title="Save"
            type="button"
            onClick={handleSave}>
            <FontAwesomeIcon fixedWidth icon="check" />
          </button>
          <button
            className="compact"
            disabled={saving}
            title="Cancel"
            type="button"
            onClick={handleCancel}>
            <FontAwesomeIcon fixedWidth icon="times" />
          </button>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{client.attributes.name}</td>
      <CopyToClipboard as="td" className={styles.idCell} text={client.id}>
        <code>{client.id}</code>
      </CopyToClipboard>
      <td>
        {client.attributes.redirectUri ?? '-'}
        {error && (<div className={styles.error}>{error}</div>)}
      </td>
      {showNamespaces && (<td>{client.attributes.namespaces?.join(', ') || '-'}</td>)}
      {showFirstParty && (<td>{client.attributes.firstParty && (<FontAwesomeIcon className={styles.firstPartyIcon} icon="circle-check" />)}</td>)}
      <td className={styles.actionsCell}>
        <button
          className="compact"
          title="Edit"
          type="button"
          onClick={handleEdit}>
          <FontAwesomeIcon fixedWidth icon="pen" />
        </button>
        <ConfirmActionButton
          className="compact"
          confirmButtonText="Regenerate"
          confirmSubText="New secret?"
          denyButtonText="Cancel"
          name={client.id}
          title="Regenerate secret"
          onConfirm={handleRegenerateSecret}
          onConfirmText="">
          <FontAwesomeIcon fixedWidth icon="sync" />
        </ConfirmActionButton>
        <ConfirmActionButton
          className="compact"
          confirmButtonText="Revoke"
          confirmSubText="Revoke all?"
          denyButtonText="Cancel"
          name={client.id}
          title="Revoke all tokens"
          onConfirm={handleRevokeTokens}
          onConfirmText="">
          <FontAwesomeIcon fixedWidth icon="lock" />
        </ConfirmActionButton>
        <ConfirmActionButton
          className="compact"
          confirmButtonText="Delete"
          confirmSubText="Delete?"
          denyButtonText="Cancel"
          name={client.id}
          onConfirm={onDelete}
          onConfirmText="">
          <FontAwesomeIcon fixedWidth icon="trash" />
        </ConfirmActionButton>
      </td>
      <SecretModalWrapped
        isOpen={showSecretModal}
        onClose={
          () => {
            return setShowSecretModal(false)
          }
        } />
    </tr>
  )
}

ClientCard.propTypes = {
  client: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  showFirstParty: PropTypes.bool,
  showNamespaces: PropTypes.bool,
}


export default ClientCard
