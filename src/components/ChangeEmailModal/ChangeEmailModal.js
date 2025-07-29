import Router from 'next/router'
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import asModal, { ModalContent, ModalFooter } from '~/components/asModal'
import EmailFieldset from '~/components/Fieldsets/EmailFieldset'
import useForm from '~/hooks/useForm'
import { logout } from '~/store/actions/session'
import { changeEmail } from '~/store/actions/user'
import {
  selectCurrentUserId,
  selectUserById,
  withCurrentUserId,
} from '~/store/selectors'
import getResponseError from '~/util/getResponseError'

import ChangeEmailMessageBox from './ChangeEmailMessageBox'

// Component Constants
const SUBMIT_AUTO_CLOSE_DELAY_TIME = 3000





function ChangeEmailModal (props) {
  const {
    onClose,
    isOpen,
  } = props

  const [result, setResult] = useState({})
  const { email } = useSelector(withCurrentUserId(selectUserById))?.attributes ?? {}

  const dispatch = useDispatch()
  const onSubmit = useCallback(async (formData) => {
    if (result.submitted) {
      setResult({ submitted: true })
    }
    const response = await dispatch(changeEmail(formData))

    const error = getResponseError(response)

    setResult({
      error,
      success: !error,
      submitted: true,
    })

    if (!error) {
      setTimeout(() => {
        if (isOpen) {
          onClose()
        }
      }, SUBMIT_AUTO_CLOSE_DELAY_TIME)

      await dispatch(logout())
      Router.reload()
    }
  }, [dispatch, isOpen, onClose, result.submitted])


  const userId = useSelector(selectCurrentUserId)
  const data = useMemo(() => {
    return {
      id: userId,
      attributes: {
        email: '',
      },
    }
  }, [userId])

  const { Form, submitting, canSubmit } = useForm({ data, onSubmit })

  return (
    <ModalContent as={Form} className="dialog no-pad">
      <ChangeEmailMessageBox result={result} />

      {
        !result.submitted && (
          <div className="info">
            <div className="email">
              <span className="label">{'Current E-Mail: '}</span>
              <span>{email}</span>
            </div>
            {'Enter the new e-mail address you would like to associate with your account below.'}
          </div>
        )
      }

      <EmailFieldset
        dark
        required
        aria-label="New E-Mail Address"
        id="NewEmailAddress"
        name="attributes.email"
        placeholder="New E-Mail Address" />

      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          <button
            className="green"
            disabled={!canSubmit || submitting || result.success}
            type="submit">
            {submitting ? 'Submitting...' : 'Change E-Mail'}
          </button>
        </div>
      </ModalFooter>
    </ModalContent>
  )
}

ChangeEmailModal.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.func.isRequired,
}





export default asModal({
  className: 'email-change-dialog',
  title: 'Change E-Mail Address',
})(ChangeEmailModal)
