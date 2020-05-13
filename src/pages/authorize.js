// Module imports
import React from 'react'





// Component imports
import { authenticated } from '~/components/AppLayout'
import { pageRedirect } from '~/helpers/gIPTools'
import { actions, connect } from '~/store'


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

    const { payload, status } = await submitOAuthDecision({
      transactionId: client.transactionId,
      allow: event.target.name === 'allow',
    })

    if (status === 'success' && payload.redirect) {
      window.location.href = payload.redirect
    }

    this.setState({ submitting: false })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps (ctx) {
    const { query, res, store } = ctx

    const { payload, response, status } = await store.dispatch(actions.getClientOAuthPage(query))

    if (status === 'success') {
      if (payload.redirect) {
        pageRedirect(ctx, payload.redirect)
        return {}
      }

      if (res && response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie'])
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
              <h3>
                {`${client.clientName} is requesting access to your FuelRats account`}
              </h3>

              <p><strong>{'This application will be able to:'}</strong></p>

              <ul>
                {'Do things that relate to these scopes:'}
                <pre>{client.scopes.join(', ')}</pre>
              </ul>
              <span>
                {'Look we\'re not 100% sure what they do but we know the app uses them somehow. The redo to this page isn\'t done yet, but we\'re focused on functionality first.'}
              </span>
              <br />
              <div>
                <img alt="deal with it" src="/static/images/dealwithit.jpg" />
              </div>
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

                  <button
                    disabled={submitting}
                    name="cancel"
                    type="button"
                    value="true"
                    onClick={this._handleSubmit}>
                    {submitting ? 'Submitting...' : 'Deny'}
                  </button>
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
