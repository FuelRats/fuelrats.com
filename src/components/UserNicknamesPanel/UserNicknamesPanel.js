import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ConfirmActionButton from '~/components/ConfirmActionButton'
import AddNicknameForm from '~/components/Forms/AddNicknameForm/AddNicknameForm'
import { deleteNickname, setDisplayNickname, getUserProfile } from '~/store/actions/user'
import {
  selectUserById,
  withCurrentUserId,
  selectNicknamesByUserId,
} from '~/store/selectors'
import getResponseError from '~/util/getResponseError'

import NicknameErrorBox from './NicknameErrorBox'
import styles from './UserNicknamesPanel.module.scss'





// Component constants
const MAX_NICKS = 16 // Maximum IRC Nicknames allowed




function UserNicknamesPanel () {
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const nicknames = useSelector(withCurrentUserId(selectNicknamesByUserId))
  const user = useSelector(withCurrentUserId(selectUserById))

  const handleDeleteNickname = useCallback(async (event) => {
    setError(null)
    const response = await dispatch(deleteNickname(user, nicknames.find((nick) => {
      return nick.id === event.target.name
    })))

    const responseError = getResponseError(response)
    if (responseError) {
      setError(responseError)
      return responseError
    }

    return true
  }, [dispatch, nicknames, user])

  const handleSetDisplayNickname = useCallback(async (event) => {
    setError(null)
    const nickname = nicknames.find((nick) => {
      return nick.id === event.target.name
    })

    const response = await dispatch(setDisplayNickname(nickname.id, nickname.attributes.nick))

    const responseError = getResponseError(response)
    if (responseError) {
      setError(responseError)
      return responseError
    }

    // Refresh user profile to get updated nicknames
    await dispatch(getUserProfile())
    return true
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
            <NicknameErrorBox error={error} />
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
                  <span>
                    {nickname.attributes?.nick}
                    {
                      isDisplayNick && (
                        <FontAwesomeIcon
                          fixedWidth
                          className={styles.displayIcon}
                          icon="star"
                          title="Current display nickname" />
                      )
                    }
                  </span>
                  <div className={styles.controlContainer}>
                    {
                      // Only show buttons for non-display nicks
                      !isDisplayNick && (
                        <>
                          <ConfirmActionButton
                            className="icon"
                            confirmButtonText={`Set '${nickname.attributes?.nick}' as display nickname`}
                            confirmSubText=""
                            denyButtonText="Cancel"
                            name={nickname.id}
                            title="Set as display nickname"
                            onConfirm={handleSetDisplayNickname}
                            onConfirmText="">
                            <FontAwesomeIcon fixedWidth icon="farStar" title="Set as display nickname" />
                          </ConfirmActionButton>
                          <ConfirmActionButton
                            className="icon"
                            confirmButtonText={`Delete nickname '${nickname.attributes?.nick}'`}
                            confirmSubText=""
                            denyButtonText="Cancel"
                            name={nickname.id}
                            title="Delete nickname"
                            onConfirm={handleDeleteNickname}
                            onConfirmText="">
                            <FontAwesomeIcon fixedWidth icon="trash" title="Delete nickname" />
                          </ConfirmActionButton>
                        </>
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
