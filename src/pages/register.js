import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import RegistrationForm, { RegistrationErrorBox } from '~/components/Forms/RegistrationForm'
import MessageBox from '~/components/MessageBox'
import useMergeReducer from '~/hooks/useMergeReducer'
import { login, register } from '~/store/actions/authentication'
import { resendVerificationEmail } from '~/store/actions/verify'
import getResponseError from '~/util/getResponseError'





function Register () {
  const dispatch = useDispatch()

  const [submitState, setSubmitState] = useMergeReducer(null)

  const handleSubmit = useCallback(
    async (data) => {
      const response = await dispatch(register(data))

      const error = getResponseError(response)

      if (!error) {
        await dispatch(login({
          remember: false,
          data: {
            password: data.attributes.password,
            username: data.attributes.email,
          },
        }))
      }

      setSubmitState({
        error,
        data,
      })
    },
    [dispatch, setSubmitState],
  )

  const handleResend = useCallback(
    async () => {
      setSubmitState({ resend: 'submit' })

      const response = await dispatch(resendVerificationEmail(submitState.data.attributes.email))

      setSubmitState({ resend: getResponseError(response) ?? true })
    },
    [dispatch, setSubmitState, submitState?.data?.attributes?.email],
  )

  if (submitState && !submitState.error) {
    return (
      <div className="page-content flex align-center ">
        <br />

        <h3>{'Incoming Mission Critical Message'}</h3>

        <span>
          {'A verification email has been sent to '}
          <code>{submitState.data.attributes.email}</code>
        </span>

        <span>
          {'Wrong email? Reach out to us by emailing '}
          <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
        </span>

        <br />

        {
          submitState.resend === true && (
            <>
              <MessageBox type="info">
                {'We have sent a new email to the address above.\n Be sure to check your spam folder!'}
              </MessageBox>
              <br />
            </>
          )
        }

        <button disabled={submitState?.resend === 'submit'} type="button" onClick={handleResend}>
          {
            submitState.resend === true
              ? 'Still didn\'t receive an email?'
              : 'Didn\'t receive an email?'
          }
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="page-margins">
        <h5>
          {'This registration page is to become a Fuel Rat!'}
          <br />
          {'Need fuel? No need to register! Just click "Get Fuel" in the sidebar!'}
        </h5>
        <br />
        <RegistrationErrorBox error={submitState?.error} />
      </div>
      <RegistrationForm onSubmit={handleSubmit} />
    </>
  )
}

Register.getPageMeta = () => {
  return {
    displayTitle: 'Become a Fuel Rat',
    title: 'Register',
    description: 'Join the elite team of rescuers in the gaming cosmos by registering with the Fuel Rats! Our registration page is your gateway to embark on thrilling rescue missions, interact with a community of passionate gamers, and make your mark in the interstellar gaming universe. Sign up to navigate through breathtaking adventures, enhance your gaming experience, and be a beacon of hope for stranded pilots across the galaxies!',
  }
}





export default Register
