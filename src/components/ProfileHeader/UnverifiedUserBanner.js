import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { resendVerificationEmail } from '~/store/actions/verify'
import { selectUserById, withCurrentUserId } from '~/store/selectors'
import getResponseError from '~/util/getResponseError'

import MessageBox from '../MessageBox'
import ApiErrorBox from '../MessageBox/ApiErrorBox'





// Component Constants
const selectCurrentUserEmail = (state) => {
  return withCurrentUserId(selectUserById)(state)?.attributes.email ?? null
}





function UnverifiedUserBanner () {
  const dispatch = useDispatch()
  const userEmail = useSelector(selectCurrentUserEmail)

  const [{ submitting, submitted, submitError }, setSubmitState] = useState({})

  const handleResubmit = useCallback(
    async () => {
      setSubmitState({
        submitting: true,
      })

      const response = await dispatch(resendVerificationEmail(userEmail))

      const error = getResponseError(response)

      setSubmitState({
        submitted: true,
        submitError: error,
      })
    },
    [dispatch, userEmail],
  )

  return (
    <div className="message-container">
      {submitError && (<ApiErrorBox className="error" error={submitError} />)}
      <MessageBox className="banner" type="warn">
        {'Hey! Your account has not yet been verified. Check your E-Mail for a verification link.'}
        <br />
        {'You have limited access to rat services and tools while unverified.'}
        <button className={['button', { green: submitted && !submitError }]} disabled={submitting} type="button" onClick={handleResubmit}>
          {
            (!submitting && (!submitted || submitError))
              && 'Resend Verification E-Mail'
          }
          {
            (submitted && !submitError)
                && (<>{'E-Mail Sent! '}<FontAwesomeIcon icon="check" /></>)
          }
          {
            submitting
              && (<>{'Sending E-Mail... '}<FontAwesomeIcon pulse icon="spinner" /></>)
          }
        </button>
      </MessageBox>
    </div>
  )
}





export default UnverifiedUserBanner
