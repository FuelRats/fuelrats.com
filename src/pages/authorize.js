import { isError } from 'flux-standard-action'
import React from 'react'

import { authenticated } from '~/components/AppLayout'
import ScopeView from '~/components/ScopeView'
import { connect } from '~/store'
import { getClientOAuthPage } from '~/store/actions/authentication'
import pageRedirect from '~/util/getInitialProps/pageRedirect'





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
        return { redirect: true }
      }

      if (res && meta.response.headers['set-cookie']) {
        res.setHeader('set-cookie', meta.response.headers['set-cookie'])
      }

      return { client: payload }
    }

    return {}
  }

  static getPageMeta (_, pageProps) {
    return {
      title: 'Authorize Application',
      className: pageProps.redirect ? 'hidden' : '',
    }
  }

  render () {
    const { client, redirect } = this.props
    const { submitting } = this.state


    if (redirect) {
      return null
    }

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
