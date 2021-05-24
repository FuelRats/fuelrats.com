import Router from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PasswordFieldset from '~/components/Fieldsets/PasswordFieldset'
import asModal, { FooterPrimary, ModalContent, ModalFooter } from '~/components/Modal'
import getResponseError from '~/helpers/getResponseError'
import useForm from '~/hooks/useForm'
import { logout } from '~/store/actions/session'
import { updateUser } from '~/store/actions/user'
import { selectCurrentUserId } from '~/store/selectors'

import DisableProfileErrorBox from './DisableProfileErrorBox'





function DisableProfileModal (props) {
  const { onClose } = props

  const [confirming, setConfirmState] = useState(false)
  const [submitError, setErrorState] = useState(null)

  const handleConfirm = useCallback(() => {
    setConfirmState((state) => {
      return !state
    })
  }, [])

  const dispatch = useDispatch()
  const onSubmit = useCallback(
    async (formData) => {
      const { password, ...submitData } = formData

      setErrorState(null)

      const response = await dispatch(updateUser(submitData, password))

      setConfirmState(false)

      const error = getResponseError(response)
      if (error) {
        setErrorState(error)
        return
      }

      onClose()
      dispatch(logout())
      Router.push('/')
    },
    [dispatch, onClose],
  )

  const userId = useSelector(selectCurrentUserId)
  const data = useMemo(() => {
    return {
      id: userId,
      type: 'users',
      attributes: {
        status: 'deactivated',
      },
      password: '',
    }
  }, [userId])

  const { Form, canSubmit, submitting } = useForm({ data, onSubmit })

  return (
    <ModalContent as={Form} className="dialog no-pad">
      <DisableProfileErrorBox className="error" error={submitError} />

      <div className="info">
        {'This will hide your profile from public view, but will not delete it from our servers. To re-enable your account, please email '}
        <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>{'.'}
        <br />
        {'You may contact '}
        <a href="mailto:gdpr@fuelrats.com">{'gdpr@fuelrats.com'}</a>
        {' to request a copy of all information stored about you, or to request a permanent deletion of all your data.'}
      </div>

      <PasswordFieldset
        dark
        required
        aria-label="Current Password"
        id="CurrentPassword"
        name="password"
        placeholder="Password" />

      <ModalFooter>
        <FooterPrimary>
          {
            confirming && (
              <>
                <div>
                  {'Are you sure?'}
                </div>
                <button
                  className="green"
                  disabled={!canSubmit || submitting}
                  type="submit">
                  {
                    submitting
                      ? 'Submitting...'
                      : 'Disable Profile'
                  }
                </button>
              </>
            )
          }
          <button
            className={{ green: !confirming }}
            disabled={(!confirming && !canSubmit) || submitting}
            type="button"
            onClick={handleConfirm}>
            {confirming ? 'Cancel' : 'Disable Profile'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </ModalContent>
  )
}




export default asModal({
  className: 'disable-profile-dialog',
  title: 'Disable Profile',
})(DisableProfileModal)
