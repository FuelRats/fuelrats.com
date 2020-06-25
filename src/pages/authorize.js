// Module imports
import { isError } from 'flux-standard-action'
import React from 'react'





// Component imports
import { authenticated } from '~/components/AppLayout'
import ScopeView from '~/components/ScopeView'
import { pageRedirect } from '~/helpers/gIPTools'
import { connect } from '~/store'
import { getClientOAuthPage } from '~/store/actions/authentication'


// For Testing
// /authorize?client_id=480f28cf-71cc-454e-b502-959d9a5346fc&redirect_uri=https://dispatch.fuelrats.com/&scope=users.read.me%20rescues.read&response_type=token&state=hello

@authenticated
@connect
class Authorize extends React.Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  state = {
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubmit = async (event) => {
    const {
      client,
      submitOAuthDecision,
    } = this.props

    this.setState({ submitting: true })

    const response = await submitOAuthDecision({
      transactionId: client.transactionId,
      allow: event.target.name === 'allow',
    })

    if (!isError(response) && response.payload.redirect) {
      window.location.href = response.payload.redirect
    }

    this.setState({ submitting: false })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps (ctx) {
    const { query, res, store } = ctx

    const response = await store.dispatch(getClientOAuthPage(query))

    if (!isError(response)) {
      const { meta, payload } = response

      if (payload.redirect) {
        pageRedirect(ctx, payload.redirect)
        return {}
      }

      if (res && meta.response.headers['set-cookie']) {
        res.setHeader('set-cookie', meta.response.headers['set-cookie'])
      }

      return { client: payload }
    }

    return {}
  }

  static getPageMeta () {
    return { title: 'Authorize Application' }
  }

  render () {
    const { client } = this.props
    const { submitting } = this.state

    return (
      <div className="page-content">
        {
          client && (
            <>
              <h4>
                {`${client.clientName} is requesting access to your Fuel Rats account`}
              </h4>
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
                    onClick={this._handleSubmit}>
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
                        onClick={this._handleSubmit}>
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





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['submitOAuthDecision']
}





export default Authorize
