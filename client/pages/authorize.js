// Module imports
import React from 'react'





// Component imports
import { PageWrapper, authenticated } from '../components/AppLayout'
import HiddenFormData from '../components/HiddenFormData'
import { actions } from '../store'





@authenticated
class Authorize extends React.Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  state = {
    submitting: false,
  }

  _formRef = React.createRef()





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ query, res, store, accessToken }, setLayoutProps) {
    const {
      client_id: clientId,
      response_type: responseType,
    } = query

    const { payload, response, status } = await actions.getClientOAuthPage(query)(store.dispatch)

    if (status === 'success') {
      const {
        client,
        ...oauthProps
      } = payload

      if (res && response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie'])
      }

      setLayoutProps({
        renderLayout: !oauthProps.preAuthorized,
      })

      return {
        accessToken,
        clientId,
        responseType,
        clientName: client.data.attributes.name,
        redirectUri: client.data.attributes.redirectUri,
        ...oauthProps,
      }
    }

    return {}
  }

  componentDidMount () {
    if (this.props.preAuthorized) {
      this._formRef.current.submit()
    }
  }

  render () {
    const {
      accessToken,
      clientId,
      clientName,
      preAuthorized,
      redirectUri,
      responseType,
      scope,
      scopes,
      transactionId,
    } = this.props
    const { submitting } = this.state

    const hasRequiredParameters = clientId && scope && responseType

    return (
      <PageWrapper className={preAuthorized ? 'hidden' : ''} title="Authorize Application">
        <div className="page-content">
          {hasRequiredParameters && (
            <>
              <h3>{clientName} is requesting access to your FuelRats account</h3>

              <p><strong>This application will be able to:</strong></p>

              <ul>
                {scopes.map(({ permission, accessible }) => (
                  <li key={permission} className={accessible ? null : 'inaccessible'}>{permission}</li>
                ))}
              </ul>

              <form
                action={`/api/oauth2/authorize?bearer=${accessToken}`}
                method="post"
                ref={this._formRef}>

                <HiddenFormData
                  data={{
                    transaction_id: transactionId, /* eslint-disable-line camelcase */// Required by API
                    scope,
                    redirectUri,
                    ...(preAuthorized ? { allow: 'true' } : {}),
                  }} />

                <div className="primary">
                  <button
                    className="green"
                    disabled={submitting}
                    name="allow"
                    value="true"
                    type="submit">
                    {submitting ? 'Submitting...' : 'Allow'}
                  </button>

                  <button
                    disabled={submitting}
                    name="cancel"
                    value="true"
                    type="submit">
                    {submitting ? 'Submitting...' : 'Deny'}
                  </button>
                </div>
              </form>
            </>
          )}

          {!hasRequiredParameters && (
            <>
              <header>
                <h3>Invalid Authorize Request</h3>
              </header>

              <p>Missing request parameters. Please contact the developer of the application you are trying to use.</p>
            </>
          )}
        </div>
      </PageWrapper>
    )
  }
}





export default Authorize
