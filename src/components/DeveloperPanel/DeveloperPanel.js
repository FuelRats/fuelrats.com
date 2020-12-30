import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { createClient, getClients } from '~/store/actions/clients'
import { selectCurrentUserId, withCurrentUserId } from '~/store/selectors'
import { selectClientsByUserId } from '~/store/selectors/clients'

import OAuthClientForm from '../Forms/OAuthClientForm'
import ClientSubmitMessageBox from './ClientSubmitMessageBox'





function DeveloperPanel () {
  const userId = useSelector(selectCurrentUserId)
  const clients = useSelector(withCurrentUserId(selectClientsByUserId))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getClients({
      filter: {
        userId: { eq: userId },
      },
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only attempt fetch on userId change and mount.
  }, [userId])


  const [clientResponse, setClientResponse] = useState(null)


  const handleClientSubmit = useCallback(async (formData) => {
    const response = await dispatch(createClient(formData))
    setClientResponse(response)
  }, [dispatch])

  return (
    <div className="user-developer-tab">
      {"Do you like my pretty page?! It's great, isn't it? Totally not a rush job at all! Actual UI to delete clients and revoke tokens coming soon™."}
      <Image alt="Kappa" height={18} layout="fixed" src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" width={84} />

      <div>
        <h4>{'Create Client'}</h4>
        <ClientSubmitMessageBox response={clientResponse} />
        <OAuthClientForm onSubmit={handleClientSubmit} />
      </div>

      <div>
        <h4>{'Client List'}</h4>
        <ul>
          {
            clients.map((client) => {
              return (
                <li key={client.id}>
                  <code>{client.attributes.name}</code>
                  {': '}
                  <code>{client.id}</code>
                  {
                    client.attributes.redirectUri && (
                      <>
                        {' | RedirectUri: '}
                        <code>{client.attributes.redirectUri ?? '(No Redirect URI)'}</code>
                      </>
                    )
                  }
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}





export default DeveloperPanel
