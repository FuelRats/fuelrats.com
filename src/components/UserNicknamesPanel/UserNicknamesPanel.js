import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ConfirmActionButton from '~/components/ConfirmActionButton'
import AddNicknameForm from '~/components/Forms/AddNicknameForm/AddNicknameForm'
import MessageBox from '~/components/MessageBox'
import { deleteNickname } from '~/store/actions/user'
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
              return (
                <li key={nickname.id}>
                  <span>{nickname.attributes?.nick}</span>
                  {
                    // Only render for additional nicks, prevent for display nick.
                    nickname.attributes?.display !== nickname.attributes?.nick && (
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
                </li>
              )
            }) ?? null
          }
        </ul>

        <div className={styles.addNicknameFloat}>
          <AddNicknameForm
            disabled={maxNicksReached}
            title={maxNicksReached ? 'You\'ve used all your nicknames' : 'Add new nickname'} />
        </div>
      </div>
    </div>
  )
}





export default UserNicknamesPanel
