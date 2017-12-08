// Module imports
import React from 'react'





// Component imports
import Component from '../components/Component'
import Page from '../components/Page'





// Component constants
const title = 'Authorize Application'





class Authorize extends Component {
  /***************************************************************************\
   Public Methods
   \***************************************************************************/

  constructor (props) {
    super(props)

    this.state = {
      clientName: null,
      scopes: [],
      transactionId: '',
      submitting: false,
    }
  }

  static async getInitialProps ({ query }) {
    if (query.redirectUri) {
      this.setState({ redirectUri: query.redirectUri })
    }
    return query
  }

  async componentDidMount () {
    const {
      client_id,
      state,
      scope,
      response_type,
    } = this.props

    /* eslint-disable camelcase */
    if (client_id && state && scope && response_type) {
    /* eslint-enable camelcase */
      try {
        const token = localStorage.getItem('access_token')

        /* eslint-disable camelcase */
        let response = await fetch(`/api/oauth2/authorize?client_id=${client_id}&scope=${scope}&state=${state}&response_type=${response_type}`, {
        /* eslint-enable camelcase */
          credentials: 'same-origin',
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
          method: 'get',
        })
        response = await response.json()

        this.setState({
          clientName: response.client.data.attributes.name,
          redirectUri: response.client.data.attributes.redirectUri,
          scopes: response.scopes,
          transactionId: response.transactionId,
          token: localStorage.getItem('access_token'),
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  render () {
    const {
      client_id,
      state,
      scope,
      response_type,
    } = this.props
    const { submitting } = this.state

    /* eslint-disable camelcase */
    const hasRequiredParameters = client_id && state && scope && response_type
    /* eslint-enable camelcase */
    const submitUrl = `/api/oauth2/authorize?bearer=${this.state.token}`

    return (
      <div>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

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
      </div>
    )
  }
}





export default Page(Authorize, title)
