// Module imports
import Cookie from 'js-cookie'
import React from 'react'





// Component imports
import Component from '../components/Component'
import connect from '../helpers/connect'
import PageWrapper from '../components/PageWrapper'





class Authorize extends Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  static authRequired = true

  state = {
    clientName: null,
    redirectUri: null,
    scopes: [],
    token: Cookie.get('access_token'),
    transactionId: '',
    submitting: false,
  }

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ query }) {
    if (query.redirectUri) {
      this.setState({ redirectUri: query.redirectUri })
    }
    return query
  }

  async componentDidMount () {
    const {
      client_id: clientId,
      state,
      scope,
      response_type: responseType,
      getClientOAuthPage,
    } = this.props

    if (clientId && scope && responseType) {
      const { payload, status } = await getClientOAuthPage({
        clientId,
        responseType,
        scope,
        state,
      })

      if (status === 'success') {
        this.setState({
          clientName: payload.client.data.attributes.name,
          redirectUri: payload.client.data.attributes.redirectUri,
          scopes: payload.scopes,
          transactionId: payload.transactionId,
        })
      }
    }
  }

  render () {
    const {
      client_id: clientId,
      scope,
      response_type: responseType,
    } = this.props
    const { submitting } = this.state

    const hasRequiredParameters = clientId && scope && responseType
    const submitUrl = `/api/oauth2/authorize?bearer=${this.state.token}`

    return (
      <PageWrapper title="Authorize Application">

        {this.state.clientName && hasRequiredParameters && (
          <div className="page-content">
            <h3>{this.state.clientName} is requesting access to your FuelRats account</h3>

            <p><strong>This application will be able to:</strong></p>

            <ul>
              {this.state.scopes.map(scopeData => (
                <li key={scopeData} className={scopeData.accessible ? 'inaccessible' : null}>{scopeData.permission}</li>
              ))}
            </ul>

            <form action={submitUrl} method="post">
              <fieldset>
                <input
                  id="transaction_id"
                  name="transaction_id"
                  type="hidden"
                  value={this.state.transactionId} />
                <input
                  id="scope"
                  name="scope"
                  type="hidden"
                  value={scope} />
                <input
                  id="redirectUri"
                  name="redirectUri"
                  type="hidden"
                  value={this.state.redirectUri} />
              </fieldset>

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
          </div>
        )}
        {hasRequiredParameters && !this.state.clientName && (
          <div className="page-content">
            <header>
              <h3>Loading Authorization Data</h3>
            </header>

            <p>Information needed to display the authorize page is being loaded.</p>
          </div>
        )}


        {!hasRequiredParameters && (
          <div className="page-content">
            <header>
              <h3>Invalid Authorize Request</h3>
            </header>

            <p>You loaded this page with missing parameters, please contact the developer of the application you are trying to use</p>
          </div>
        )}
      </PageWrapper>
    )
  }
}





export default connect(null, ['getClientOAuthPage'])(Authorize)
