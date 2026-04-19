import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { deleteClient, getClients } from '~/store/actions/clients'
import {
  selectCurrentUserId, selectCurrentUserHasScope, withCurrentUserId,
} from '~/store/selectors'
import { selectClientsByUserId } from '~/store/selectors/clients'
import getResponseError from '~/util/getResponseError'

import ClientCard from './ClientCard'
import CreateClientModal from './CreateClientModal'
import styles from './DeveloperPanel.module.scss'


function ClientTable ({ clients, onDelete, isAdmin }) {
  const showNamespaces = useMemo(() => {
    return clients.some((cl) => {
      return cl.attributes.namespaces?.length > 0
    })
  }, [clients])

  const showFirstParty = useMemo(() => {
    return clients.some((cl) => {
      return cl.attributes.firstParty
    })
  }, [clients])

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{'Name'}</th>
          <th>{'Client ID'}</th>
          <th>{'Redirect URI'}</th>
          {showNamespaces && (<th>{'Namespaces'}</th>)}
          {showFirstParty && (<th>{'1st Party'}</th>)}
          <th />
        </tr>
      </thead>
      <tbody>
        {
          clients.map((client) => {
            return (
              <ClientCard
                key={client.id}
                client={client}
                isAdmin={isAdmin}
                showFirstParty={showFirstParty}
                showNamespaces={showNamespaces}
                onDelete={onDelete} />
            )
          })
        }
      </tbody>
    </table>
  )
}


function DeveloperPanel () {
  const userId = useSelector(selectCurrentUserId)
  const clients = useSelector(withCurrentUserId(selectClientsByUserId))
  const isAdmin = useSelector((state) => {
    return selectCurrentUserHasScope(state, { scope: 'clients.write' })
  })
  const dispatch = useDispatch()

  const [clientListError, setClientListError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchClients = useCallback(() => {
    setClientListError(null)
    return Promise.resolve(dispatch(getClients({
      filter: {
        userId: { eq: userId },
      },
    }))).then((result) => {
      const err = getResponseError(result)
      if (err) {
        setClientListError(err.detail ?? 'Failed to load clients.')
      }
    })
  }, [dispatch, userId])

  useEffect(() => {
    fetchClients()
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only attempt fetch on userId change and mount.
  }, [userId])

  const handleDeleteClient = useCallback(async (event) => {
    const clientId = event.target.name
    await dispatch(deleteClient(clientId))
    fetchClients()
    return true
  }, [dispatch, fetchClients])

  const handleCreateModalClose = useCallback(() => {
    setShowCreateModal(false)
    fetchClients()
  }, [fetchClients])

  return (
    <div className={styles.developerTab}>
      <div className="panel">
        <header>
          {'OAuth Clients'}
          <menu>
            <button
              className="compact green"
              type="button"
              onClick={
                () => {
                  return setShowCreateModal(true)
                }
              }>
              <FontAwesomeIcon fixedWidth icon="plus" />
              {' New Client'}
            </button>
          </menu>
        </header>
        <div className={styles.content}>
          {clientListError && (<p className={styles.error}>{clientListError}</p>)}
          {
            clients.length === 0 && !clientListError && (
              <div className={styles.empty}>{'No OAuth clients registered.'}</div>
            )
          }
          {
            clients.length > 0 && (
              <ClientTable
                clients={clients}
                isAdmin={isAdmin}
                onDelete={handleDeleteClient} />
            )
          }
        </div>
      </div>

      <CreateClientModal
        isOpen={showCreateModal}
        onClose={handleCreateModalClose} />
    </div>
  )
}


export default DeveloperPanel
