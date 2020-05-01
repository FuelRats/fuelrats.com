// Module imports
import React from 'react'





// Component imports
import { authenticated } from '../components/AppLayout'
import HiddenFormData from '../components/HiddenFormData'
import { actions } from '../store'


// For Testing
// /authorize?client_id=480f28cf-71cc-454e-b502-959d9a5346fc&redirect_uri=https://dispatch.fuelrats.com/&scope=users.read.me%20rescues.read&response_type=token&state=hello

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

  static async getInitialProps ({ query, res, store, accessToken }) {
    const {
      client_id: clientId,
      response_type: responseType,
    } = query

    const { payload, response, status } = await store.dispatch(actions.getClientOAuthPage(query))

    if (status === 'success') {
      const {
        client,
        ...oauthProps
      } = payload

      if (res && response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie'])
      }

      return {
        accessToken,
        clientId,
        responseType,
        clientName: client?.attributes?.name,
        redirectUri: client?.attributes?.redirectUri,
        ...oauthProps,
      }
    }

    return {}
  }

  static getPageMeta (_, { preAuthorized }) {
    return {
      noLayout: preAuthorized,
      className: preAuthorized ? 'hidden' : '',
      title: 'Authorize Application',
    }
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
      transactionId,
    } = this.props
    const { submitting } = this.state

    const hasRequiredParameters = clientId && scope && responseType

    const formData = {
      transaction_id: transactionId, /* eslint-disable-line camelcase */// Required by API
      scope,
      redirectUri,
      ...(preAuthorized ? { allow: 'true' } : {}),
    }

    return (
      <div className="page-content">
        {
          hasRequiredParameters && (
            <>
              <h3>{`${clientName} is requesting access to your FuelRats account`}</h3>

              <p><strong>{'This application will be able to:'}</strong></p>

              <ul>
                {'Do things that relate to these scopes:'}
                <pre>{scope}</pre>
              </ul>
              <span>
                {'Look we\'re not 100% sure what they do but we know the app uses them somehow. The redo to this page isn\'t done yet, but we\'re focused on functionality first.'}
              </span>
              <div>
                <img alt="deal with it" src="/static/images/dealwithit.jpg" />
              </div>
              <form
                ref={this._formRef}
                action={`/api/oauth2/authorize?bearer=${accessToken}`}
                method="post">

                <HiddenFormData data={formData} />

                <div className="primary">
                  <button
                    className="green"
                    disabled={submitting}
                    name="allow"
                    type="submit"
                    value="true">
                    {submitting ? 'Submitting...' : 'Allow'}
                  </button>

                  <button
                    disabled={submitting}
                    name="cancel"
                    type="submit"
                    value="true">
                    {submitting ? 'Submitting...' : 'Deny'}
                  </button>
                </div>
              </form>
            </>
          )
        }

        {
          !hasRequiredParameters && (
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
}





export default Authorize
