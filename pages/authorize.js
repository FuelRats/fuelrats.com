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
      clientName: 'Application',
      scopes: [],
      scope: '',
      transactionId: '',
      submitting: false
    }

    this._bindMethods([
      'onSubmit',
    ])
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
        let response = await fetch(`/api/oauth2/authorize?client_id=${client_id}&scope=${scope}&state=${state}&response_type=${response_type}`, {
          method: 'get',
        })
        response = await response.json()

        this.setState({
          clientName: response.client.data.attributes.name,
          redirectUri: response.client.data.attributes.redirectUri,
          scopes: response.scopes,
          scope: response.scope,
          transactionId: response.transactionId,
          allow: false
        })

        return {
        }

      } catch (error) {
        console.log(error)
        return {}
      }
    }
  }

  async onSubmit (event) {
    event.preventDefault()

    this.setState({ submitting: true })

    await this.props.authorize(this.state.transactionId, this.state.scope, this.state.allow, this.state.redirectUri)

    this.setState({ submitting: false })
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

    return (
      <div>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        {hasRequiredParameters && (
          <div className="page-content">
            <h3>{this.state.clientName} is requesting access to your FuelRats account</h3>

            <p><strong>This application will be able to:</strong></p>

            <ul>
              {this.state.scopes.map((scope, index) => <li key={index}>{scope.permission}</li>)}
            </ul>

            <form onSubmit={this.onSubmit}>
              <fieldset>
                <input
                  disabled={submitting}
                  id="transaction_id"
                  name="transaction_id"
                  type="hidden"
                  value="{this.state.transactionId}" />
              </fieldset>

              <div className="primary">
                <button
                  disabled={submitting}
                  onClick={() => { this.setState({ allow: true }) }}
                  value="allow"
                  type="submit">
                  {submitting ? 'Submitting...' : 'Allow'}
                </button>

                <button
                  disabled={submitting}
                  onClick={() => { this.setState({ allow: false }) }}
                  value="deny"
                  type="submit">
                  {submitting ? 'Submitting...' : 'Deny'}
                </button>
              </div>
            </form>
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
    authorize: bindActionCreators(actions.authorize, dispatch),
  }
}





export default Page(Authorize, title, {
  mapDispatchToProps,
})