import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import asModal, {
  ModalContent, ModalFooter, FooterPrimary,
} from '~/components/asModal'
import CopyToClipboard from '~/components/CopyToClipboard'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import { createClient } from '~/store/actions/clients'
import { selectCurrentUserHasScope } from '~/store/selectors'
import getResponseError from '~/util/getResponseError'

import styles from './DeveloperPanel.module.scss'


function CreateClientModal ({ onClose }) {
  const dispatch = useDispatch()
  const isAdmin = useSelector((state) => {
    return selectCurrentUserHasScope(state, { scope: 'clients.write' })
  })

  const [name, setName] = useState('')
  const [redirectUri, setRedirectUri] = useState('')
  const [namespaces, setNamespaces] = useState('')
  const [firstParty, setFirstParty] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setError(null)

    const data = {
      type: 'clients',
      attributes: {
        name,
        redirectUri: redirectUri || undefined,
      },
    }

    if (isAdmin) {
      if (namespaces.trim()) {
        data.attributes.namespaces = namespaces.split(',').map((ns) => {
          return ns.trim()
        }).filter(Boolean)
      }
      data.attributes.firstParty = firstParty
    }

    const response = await dispatch(createClient(data))
    const err = getResponseError(response)
    if (err) {
      setError(err)
      setSubmitting(false)
      return
    }

    setResult({
      clientId: response.payload?.data?.id,
      secret: response.payload?.meta?.secret,
    })
    setSubmitting(false)
  }, [dispatch, name, redirectUri, namespaces, firstParty, isAdmin])

  if (result) {
    return (
      <ModalContent>
        <div className={styles.resultPanel}>
          <div className={styles.resultField}>
            <span className={styles.resultLabel}>{'Client ID'}</span>
            <CopyToClipboard doHint className={styles.resultValue} text={result.clientId}>
              <code>{result.clientId}</code>
            </CopyToClipboard>
          </div>
          <div className={styles.resultField}>
            <span className={styles.resultLabel}>{'Client Secret'}</span>
            <CopyToClipboard doHint className={styles.resultValue} text={result.secret}>
              <code>{result.secret}</code>
            </CopyToClipboard>
          </div>
          <p className={styles.secretWarning}>
            <FontAwesomeIcon icon="exclamation-triangle" />
            {' Save your client secret now. You will not be able to see it again.'}
          </p>
        </div>
        <ModalFooter>
          <FooterPrimary>
            <button
              className="green"
              type="button"
              onClick={onClose}>
              {'Done'}
            </button>
          </FooterPrimary>
        </ModalFooter>
      </ModalContent>
    )
  }

  return (
    <ModalContent>
      {error && (<ApiErrorBox error={error} />)}

      <div className={styles.modalForm}>
        <label className={styles.modalField}>
          <span>{'Name'}</span>
          <input
            aria-label="Client name"
            disabled={submitting}
            placeholder="My Application"
            type="text"
            value={name}
            onChange={
              (event) => {
                return setName(event.target.value)
              }
            } />
        </label>

        <label className={styles.modalField}>
          <span>{'Redirect URI'}</span>
          <input
            aria-label="Redirect URI"
            disabled={submitting}
            placeholder="https://example.com/callback"
            type="url"
            value={redirectUri}
            onChange={
              (event) => {
                return setRedirectUri(event.target.value)
              }
            } />
        </label>

        {
          isAdmin && (
            <>
              <label className={styles.modalField}>
                <span>{'Namespaces'}</span>
                <input
                  aria-label="Namespaces"
                  disabled={submitting}
                  placeholder="Comma-separated namespaces"
                  type="text"
                  value={namespaces}
                  onChange={
                    (event) => {
                      return setNamespaces(event.target.value)
                    }
                  } />
              </label>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    aria-label="First party client"
                    checked={firstParty}
                    disabled={submitting}
                    type="checkbox"
                    onChange={
                      (event) => {
                        return setFirstParty(event.target.checked)
                      }
                    } />
                  {'First-party client'}
                </label>
              </div>
            </>
          )
        }
      </div>

      <ModalFooter>
        <FooterPrimary>
          <button
            className="green"
            disabled={submitting || !name.trim()}
            type="button"
            onClick={handleSubmit}>
            {submitting ? 'Creating...' : 'Create Client'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </ModalContent>
  )
}


export default asModal({
  className: 'login-dialog',
  title: 'Register OAuth Client',
})(CreateClientModal)
