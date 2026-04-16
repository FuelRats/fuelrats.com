import hoistNonReactStatics from 'hoist-non-react-statics'
import { useEffect, useState } from 'react'




// Component Constants
const STRIPE_API_PK = process.env.NEXT_PUBLIC_STRIPE_API_PK




/*
 * HOC to wrap a page with Stripe context.
 */
const withStripe = (Component) => {
  function StripePage (props) {
    const [stripe, setStripe] = useState(null)

    useEffect(() => {
      if (window.Stripe) {
        setStripe(window.Stripe(STRIPE_API_PK))
        return undefined
      }

      const script = document.querySelector('#stripe-js')
      if (!script) {
        return undefined
      }
      const handleLoad = () => {
        setStripe(window.Stripe(STRIPE_API_PK))
      }
      script.addEventListener('load', handleLoad)
      return () => {
        script.removeEventListener('load', handleLoad)
      }
    }, [])

    return <Component {...props} stripe={stripe} />
  }

  StripePage.displayName = `StripePage(${Component.displayName ?? Component.name ?? 'Component'})`

  return hoistNonReactStatics(StripePage, Component)
}




export default withStripe
