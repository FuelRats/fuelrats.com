import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ConfirmActionButton from '~/components/ConfirmActionButton'
import AddNicknameForm from '~/components/Forms/AddNicknameForm/AddNicknameForm'
import MessageBox from '~/components/MessageBox'
import { deleteNickname, setDisplayNickname, getUserProfile } from '~/store/actions/user'
import {
  selectUserById,
  withCurrentUserId,
  selectNicknamesByUserId,
} from '~/store/selectors'

import styles from './UserNicknamesPanel.module.scss'





// Component constants
const MAX_NICKS = 16 // Maximum IRC Nicknames allowed




function UserNicknamesPanel () {
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const nicknames = useSelector(withCurrentUserId(selectNicknamesByUserId))
  const user = useSelector(withCurrentUserId(selectUserById))

  const handleDeleteNickname = useCallback(async (event) => {
    const response = await dispatch(deleteNickname(user, nicknames.find((nick) => {
      return nick.id === event.target.name
    })))

    if (isError(response)) {
      const { meta, payload } = response
      let errorMessage = 'Unknown error occurred.'

      if (HttpStatus.isClientError(meta.response.status)) {
        errorMessage = payload.errors?.length ? payload.errors[0].detail : 'Client communication error'
      }

      if (HttpStatus.isServerError(meta.response.status)) {
        errorMessage = 'Server communication error'
      }

      setError(errorMessage)
      return errorMessage
    }

    return undefined
  }, [dispatch, nicknames, user])

  const handleSetDisplayNickname = useCallback(async (event) => {
    const nickname = nicknames.find((nick) => {
      return nick.id === event.target.name
    })

    const response = await dispatch(setDisplayNickname(nickname.id, nickname.attributes.nick))

    if (!isError(response)) {
      // Refresh user profile to get updated nicknames
      await dispatch(getUserProfile())
    }
  }, [dispatch, nicknames])

  const nickCount = nicknames?.length
  const maxNicksReached = (nickCount >= MAX_NICKS)

  return (
    <div className="panel">
      <header>
        {'IRC Nicknames'}
        <div className="controls">
          <span className="nickname-count">{`${nickCount}/${MAX_NICKS}`}</span>
        </div>
      </header>

      <div className={styles.userNicknames}>
        {
          error && (
            <MessageBox>{error}</MessageBox>
          )
        }
        <ul className={styles.nickList}>
          {
            (nickCount <= 0) && (
              <li className="text-center">{'You do not have any nicknames registered yet.'}</li>
            )
          }
          {
            nicknames?.map((nickname) => {
              const isDisplayNick = nickname.attributes?.display === nickname.attributes?.nick
              return (
                <li key={nickname.id}>
                  <span>{nickname.attributes?.nick}</span>
                  <div>
                    {
                      // Only show set display button for non-display nicks
                      !isDisplayNick && (
                        <ConfirmActionButton
                          className="icon"
                          confirmButtonText={`Set '${nickname.attributes?.nick}' as display nickname`}
                          confirmSubText=""
                          denyButtonText="Cancel"
                          name={nickname.id}
                          onConfirm={handleSetDisplayNickname}
                          onConfirmText="">
                          <FontAwesomeIcon fixedWidth icon="star" />
                        </ConfirmActionButton>
                      )
                    }
                    {
                      // Only render for additional nicks, prevent for display nick.
                      !isDisplayNick && (
                        <ConfirmActionButton
                          className="icon"
                          confirmButtonText={`Delete nickname '${nickname.attributes?.nick}'`}
                          confirmSubText=""
                          denyButtonText="Cancel"
                          name={nickname.id}
                          onConfirm={handleDeleteNickname}
                          onConfirmText="">
                          <FontAwesomeIcon fixedWidth icon="trash" />
                        </ConfirmActionButton>
                      )
                    }
                  </div>
                </li>
              )
            }) ?? null
          }
        </ul>

        <div className={styles.addNicknameFloat}>
          <AddNicknameForm
            disabled={maxNicksReached}
            registeredNicks={nicknames}
            title={maxNicksReached ? 'You\'ve used all your nicknames' : 'Add new nickname'} />
        </div>
      </div>
    </div>
  )
}





export default UserNicknamesPanel
