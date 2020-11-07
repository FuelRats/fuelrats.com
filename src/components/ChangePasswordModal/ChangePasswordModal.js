import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import getResponseError from '~/helpers/getResponseError'
import useForm from '~/hooks/useForm'
import { changePassword } from '~/store/actions/authentication'
import { selectCurrentUserId } from '~/store/selectors'

import PasswordFieldset, { NewPasswordFieldset } from '../Fieldsets/PasswordFieldset'
import asModal, { ModalContent, ModalFooter } from '../Modal'
import ChangePasswordMessageBox from './ChangePasswordMessageBox'




// Component Constants
const SUBMIT_AUTO_CLOSE_DELAY_TIME = 3000




function ChangePasswordModal (props) {
  const {
    onClose,
    isOpen,
  } = props

  const [result, setResult] = useState({})

  const dispatch = useDispatch()
  const onSubmit = useCallback(async (formData) => {
    const response = await dispatch(changePassword(formData))

    const error = getResponseError(response)

    setResult({
      error,
      success: !error,
    })

    if (!error) {
      setTimeout(() => {
        if (isOpen) {
          onClose()
        }
      }, SUBMIT_AUTO_CLOSE_DELAY_TIME)
    }
  }, [dispatch, isOpen, onClose])


  const userId = useSelector(selectCurrentUserId)
  const data = useMemo(() => {
    return {
      id: userId,
      attributes: {
        password: '',
        newPassword: '',
      },
    }
  }, [userId])

  const { Form, submitting, canSubmit } = useForm({ data, onSubmit })

  return (
    <ModalContent as={Form} className="dialog no-pad">
      <ChangePasswordMessageBox result={result} />

      <PasswordFieldset
        dark
        required
        aria-label="Current Password"
        id="CurrentPassword"
        name="attributes.password"
        placeholder="Current Password" />

      <NewPasswordFieldset
        dark
        required
        aria-label="New Password"
        id="NewPassword"
        name="attributes.newPassword"
        placeholder="New Password" />

      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          <button
            className="green"
            disabled={!canSubmit || submitting || result.success}
            type="submit">
            {submitting ? 'Submitting...' : 'Change Password'}
          </button>
        </div>
      </ModalFooter>
    </ModalContent>
  )
}

ChangePasswordModal.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.func.isRequired,
}





export default asModal({
  className: 'password-change-dialog',
  title: 'Change Password',
})(ChangePasswordModal)
