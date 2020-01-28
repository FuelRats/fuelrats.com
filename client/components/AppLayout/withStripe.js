// Module imports
import hoistNonReactStatics from 'hoist-non-react-statics'
import getConfig from 'next/config'
import React from 'react'





// Component Constants
const { publicRuntimeConfig } = getConfig()
const STRIPE_API_PK = publicRuntimeConfig.apis.stripe.public





/**
 * Decorator to wrap a page with stripe context
 */
const withStripe = (Component) => {
  class StripePage extends React.Component {
    state = {
      stripe: null,
    }

    componentDidMount () {
      if (!this.state.stripe) {
        if (window.Stripe) {
          this.setState({ stripe: window.Stripe(STRIPE_API_PK) })
        } else {
          document.querySelector('#stripe-js').addEventListener('load', () => {
            this.setState({ stripe: window.Stripe(STRIPE_API_PK) })
          })
        }
      }
    }

    render () {
      return (
        <Component {...this.props} stripe={this.state.stripe} />
      )
    }
  }

  return hoistNonReactStatics(StripePage, Component)
}





export default withStripe
