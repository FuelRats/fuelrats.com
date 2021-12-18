import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import IRCNickFieldset from '~/components/Fieldsets/IRCNickFieldset'
import useForm from '~/hooks/useForm'
import { addNickname } from '~/store/actions/user'
import { selectUserById, withCurrentUserId } from '~/store/selectors'

import styles from './AddNicknameForm.module.scss'


const initialState = {
  attributes: {
    nick: '',
  },
}


function AddNicknameForm (props) {
  const user = useSelector(withCurrentUserId(selectUserById))
  const [error, setSubmitError] = useState(null)
  const dispatch = useDispatch()

  const onSubmit = useCallback(async (data, _, reset) => {
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
  }, [dispatch, user])

  const { Form, canSubmit } = useForm({ onSubmit, data: initialState })

  return (
    <Form className={styles.addNicknameForm}>
      <IRCNickFieldset
        required
        aria-label="Nickname"
        className={[styles.thinInput, error && styles.error]}
        disabled={props.disabled}
        id="AddNickname"
        name="attributes.nick"
        placeholder={error ?? 'Add a nickname...'}
        title={props.title} />

      <button
        aria-label="submit new nickname"
        className="green compact"
        disabled={!canSubmit || props.disabled}
        type="submit">
        <FontAwesomeIcon fixedWidth icon="arrow-right" />
      </button>
    </Form>
  )
}





export default AddNicknameForm
