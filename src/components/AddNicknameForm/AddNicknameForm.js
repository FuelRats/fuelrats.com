import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import InfoBubble from '~/components/InfoBubble'
import useForm from '~/hooks/useForm'
import { addNickname } from '~/store/actions/user'
import { selectUserById, withCurrentUserId } from '~/store/selectors'

import IRCNickFieldset from '../Fieldsets/IRCNickFieldset'
import styles from './AddNicknameForm.module.scss'


const formData = {
  attributes: {
    nick: '',
  },
}


function AddNicknameForm (props) {
  const user = useSelector(withCurrentUserId(selectUserById))
  const [error, setSubmitError] = useState(null)
  const dispatch = useDispatch()

  const onSubmit = async (data, _, reset) => {
    const response = await dispatch(addNickname(user, data))

    if (isError(response)) {
      const { meta, payload } = response
      let errorMessage = 'Unknown error occured.'

      if (meta.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
        errorMessage = 'Nickname invalid'
      } else if (meta.response.status === HttpStatus.CONFLICT) {
        errorMessage = 'Nickname already registered'
      } else if (HttpStatus.isClientError(meta.response.status)) {
        errorMessage = payload?.errors?.[0]?.title ?? 'Client communication error'
      } else if (HttpStatus.isServerError(meta.response.status)) {
        errorMessage = 'Server communication error'
      }

      setSubmitError(errorMessage)
    }

    reset()
  }

  const { Form, canSubmit } = useForm({ onSubmit, data: formData })

  return (
    <Form className={styles.addNicknameForm}>
      <IRCNickFieldset
        aria-label="Nickname"
        className={[styles.thinInput, error && styles.error]}
        id="AddNickname"
        name="attributes.nick"
        placeholder={error ?? 'Add a nickname...'}
        title={props.title}>
        <InfoBubble className={styles.nicknamesInfo} header="reminder" id="NickRegisterReminder">
          {"You cannot register a nick that's in use on IRC. Switch to a temporary one before registering!"}
        </InfoBubble>
      </IRCNickFieldset>

      <button
        aria-label="submit new nickname"
        className="green compact"
        disabled={!canSubmit}
        type="submit">
        <FontAwesomeIcon fixedWidth icon="arrow-right" />
      </button>
    </Form>
  )
}





export default AddNicknameForm
