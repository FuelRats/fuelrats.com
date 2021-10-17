import Link from 'next/link'
import Router from 'next/router'
import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import PasswordResetForm from '~/components/Forms/PasswordResetForm'
import MessageBox from '~/components/MessageBox'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { validatePasswordResetToken, resetPassword } from '~/store/actions/authentication'
import { verifyEmailToken } from '~/store/actions/verify'
import { selectCurrentUserHasScope } from '~/store/selectors'
import pageRedirect from '~/util/getInitialProps/pageRedirect'
import getResponseError from '~/util/getResponseError'





const RESET_SUCCESS_REDIRECT_WAIT = 6000 // 6 Seconds

const TokenType = {
  RESET: 'reset',
  EMAIL: 'email',
}



function Verify ({ token }) {
  const [{ submitted, error }, setSubmitState] = useState({ submitted: false })

  const dispatch = useDispatch()

  const userIsVerified = useSelectorWithProps({ scope: 'users.verified' }, selectCurrentUserHasScope)

  const onSubmit = useCallback(async (formData) => {
    const response = await dispatch(resetPassword(token.value, formData))

    const resError = getResponseError(response)
    setSubmitState({ submitted: true, error: resError })

    if (!resError) {
      setTimeout(() => {
        Router.push('/?authenticate=true')
      }, RESET_SUCCESS_REDIRECT_WAIT)
    }
  }, [dispatch, token.value])

  if (!token.valid) {
    let message = 'The provided token is invalid, which probably means it has expired. Please try resetting your password again. If the problem persists,'


    if (token.type === TokenType.EMAIL) {
      if (userIsVerified) {
        return (
          <div className="page-content">
            <MessageBox title="Already Verified" type="info">
              {"Your e-mail address has already been verified! There's no need to verify again."}
            </MessageBox>
          </div>
        )
      }

      message = (
        <>
          {"The provided token is invalid. This probably means you've already verified your e-mail address."}
          {' Please try checking your '}
          <Link href="/profile/overview"><a>{'profile'}</a></Link>
          {' for a '}
          <span className="badge info inline">{'verified'}</span>
          {' badge next to your avatar.'}
          <br />
          <br />
          {"If you're still unverified,"}
        </>
      )
    }

    return (
      <div className="page-content">
        <MessageBox title="Invalid Token">
          {message}
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
    case TokenType.RESET:
      response = await store.dispatch(validatePasswordResetToken(token))
      destination = null
      break

    case TokenType.EMAIL:
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
  let title = ''

  switch (query?.type) {
    case TokenType.RESET:
      title = 'Reset Password'
      break

    case TokenType.EMAIL:
      title = 'Verification'
      break

    default:
      title = 'Error'
      break
  }


  return {
    className: 'verify-page',
    title,
  }
}





export default Verify
