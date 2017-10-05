// Module imports
import { bindActionCreators } from 'redux'
import React from 'react'





// Component imports
import { actions } from '../store'
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
      scope: '',
      transactionId: '',
      submitting: false
    }
  }

  static async getInitialProps ({ query }) {
    if (query.redirectUri) {
      this.setState({
        redirectUri: query.redirectUri
      })
    }
    return query
  }

  async componentDidMount () {
    let { client_id, state, scope, response_type } = this.props

    if (client_id && state && scope && response_type) {
      try {
        let token = localStorage.getItem('access_token')
        let response = await fetch(`/api/oauth2/authorize?client_id=${client_id}&scope=${scope}&state=${state}&response_type=${response_type}`, {
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
          scope: response.scope,
          transactionId: response.transactionId,
          allow: false,
          token: localStorage.getItem('access_token')
        })

      } catch (error) {
        console.log(error)
      }
    }
  }

  render () {
    let {
      client_id,
      state,
      scope,
      response_type
    } = this.props
    let {
      submitting,
    } = this.state

    let hasRequiredParameters = client_id && state && scope && response_type
    let submitUrl = `/api/oauth2/authorize?bearer=${this.state.token}`

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
              {this.state.scopes.map((scope, index) => {
                if (scope.accessible) {
                  return <li key={index}>{scope.permission}</li>
                } else {
                  return <li key={index} className="inaccessible">{scope.permission}</li>
                }
              })}
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
                  value={this.state.scope} />
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
                  value="allow"
                  type="submit">
                  {submitting ? 'Submitting...' : 'Allow'}
                </button>

                <button
                  disabled={submitting}
                  value="deny"
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






const mapDispatchToProps = dispatch => {
  return {
  }
}





export default Page(Authorize, title, {
  mapDispatchToProps,
})
