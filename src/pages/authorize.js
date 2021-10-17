import { isError } from 'flux-standard-action'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import ScopeView from '~/components/ScopeView'
import { getClientOAuthPage, submitOAuthDecision } from '~/store/actions/authentication'
import pageRedirect from '~/util/getInitialProps/pageRedirect'





function Authorize (props) {
  const { client, redirect } = props
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = useCallback(async (event) => {
    setSubmitting(true)

    const response = await dispatch(submitOAuthDecision({
      transactionId: client.transactionId,
      allow: event.target.name === 'allow',
    }))

    if (!isError(response) && response.payload.redirect) {
      window.location.href = response.payload.redirect
      return
    }

    setSubmitting(false)
  }, [client.transactionId, dispatch])

  if (redirect) {
    return null
  }

  return (
    <div className="page-content">
      {
        client && (
          <>
            <h4>{`${client.clientName} is requesting access to your Fuel Rats account`}</h4>
            <br />
            <span><b>{'This application will be able to:'}</b></span>

            <ScopeView scopes={client.scopes} />

            <form>
              <div className="primary">
                <button
                  className="green"
                  disabled={submitting}
                  name="allow"
                  type="button"
                  value="true"
                  onClick={handleSubmit}>
                  {submitting ? 'Submitting...' : 'Allow'}
                </button>
                {' '}
                {
                  !submitting && (
                    <button
                      disabled={submitting}
                      name="cancel"
                      type="button"
                      value="true"
                      onClick={handleSubmit}>
                      {'Deny'}
                    </button>
                  )
                }
              </div>
            </form>
          </>
        )
      }
      {
        !client && (
          <>
            <header>
              <h3>{'Invalid Authorize Request'}</h3>
            </header>

            <p>{'Missing request parameters. Please contact the developer of the application you are trying to use.'}</p>
          </>
        )
      }
    </div>
  )
}

Authorize.getInitialProps = async (ctx) => {
  const { query, res, store } = ctx

  const response = await store.dispatch(getClientOAuthPage(query))

  if (!isError(response)) {
    const { meta, payload } = response

    if (payload.redirect) {
      pageRedirect(ctx, payload.redirect)
      return { redirect: true }
    }

    if (res && meta.response.headers['set-cookie']) {
      res.setHeader('set-cookie', meta.response.headers['set-cookie'])
    }

    return { client: payload }
  }

  return {}
}

Authorize.getPageMeta = (_, pageProps) => {
  return {
    title: 'Authorize Application',
    className: pageProps.redirect ? 'hidden' : '',
  }
}

export default authenticated(Authorize)
