import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import PasswordResetForm from '~/components/Forms/PasswordResetForm'
import MessageBox from '~/components/MessageBox'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import getResponseError from '~/helpers/getResponseError'
import { pageRedirect } from '~/helpers/gIPTools'
import { Router } from '~/routes'
import { validatePasswordResetToken, resetPassword } from '~/store/actions/authentication'
import { verifyEmailToken } from '~/store/actions/verify'





const RESET_SUCCESS_REDIRECT_WAIT = 6000 // 6 Seconds





function Verify ({ token }) {
  const [{ submitted, error }, setSubmitState] = useState({ submitted: false })

  const dispatch = useDispatch()

  const onSubmit = useCallback(async (formData) => {
    const response = await dispatch(resetPassword(token.value, formData))

    const resError = getResponseError(response)
    setSubmitState({ submitted: true, error: resError })

    if (!resError) {
      setTimeout(() => {
        Router.pushRoute('home', { authenticate: true })
      }, RESET_SUCCESS_REDIRECT_WAIT)
    }
  }, [dispatch, token.value])

  if (!token.valid) {
    return (
      <div className="page-content">
        <MessageBox title="Invalid Token">
          {token.type === 'reset' && 'Your token is invalid, which probably just means it expired. Please try resetting your password again. If the problem persists, please'}
          {token.type !== 'reset' && 'The provided token is invalid. Please'}
          {' contact us via email at: '}
          <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
          {
            token.errorId && (
              <>
                {' with the following error ID: '}
                <br />
                <code>{token.errorId}</code>
              </>
            )
          }
        </MessageBox>
      </div>
    )
  }

  return (
    <div className="page-content">
      {
        // Render on submission error
        submitted && error && (
          <ApiErrorBox error={error} />
        )
      }

      {
        // Render when password is successfully reset!
        submitted && !error && (
          <MessageBox title="Password Changed" type="info">
            <span>{'Your password has been changed! You may now login with your new credentials.'}</span>
            <span>{'You will soon be redirected to the front page...'}</span>
          </MessageBox>
        )
      }

      {
        // Render when not submitted or if there is an error to allow re-submission
        Boolean(!submitted || error) && (
          <PasswordResetForm onSubmit={onSubmit} />
        )
      }
    </div>
  )
}

Verify.getInitialProps = async (ctx) => {
  const { query, store } = ctx
  const { type, t: token, change } = query
  let destination = null
  let response = null

  switch (type) {
    case 'reset':
      response = await store.dispatch(validatePasswordResetToken(token))
      destination = null
      break

    case 'email':
      response = await store.dispatch(verifyEmailToken(token))
      destination = `/profile/overview?fl=${change === 'true' ? '0' : '1'}`
      break

    default:
      destination = '/'
      break
  }

  const error = getResponseError(response)

  if (!error && destination) {
    pageRedirect(ctx, destination)
  }

  return {
    token: {
      type,
      value: token,
      valid: !error,
      errorId: error?.id,
    },
  }
}

Verify.getPageMeta = ({ query }) => {
  return {
    className: 'verify-page',
    title: query?.type === 'reset' ? 'Reset Password' : 'Verification',
  }
}





export default Verify
