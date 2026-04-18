import getConfig from 'next/config'
import { useEffect, useState } from 'react'


const { publicRuntimeConfig } = getConfig() ?? {}




/*
 * HOC to wrap a page with Stripe context.
 */
const withStripe = (Component) => {
  function StripePage (props) {
    const [stripe, setStripe] = useState(null)

    useEffect(() => {
      if (window.Stripe) {
        setStripe(window.Stripe(publicRuntimeConfig?.stripeApiPk))
        return undefined
      }

      const script = document.querySelector('#stripe-js')
      if (!script) {
        return undefined
      }
      const handleLoad = () => {
        setStripe(window.Stripe(publicRuntimeConfig?.stripeApiPk))
      }
      script.addEventListener('load', handleLoad)
      return () => {
        script.removeEventListener('load', handleLoad)
      }
    }, [])

    return <Component {...props} stripe={stripe} />
  }

  StripePage.displayName = `StripePage(${Component.displayName ?? Component.name ?? 'Component'})`
  StripePage.getInitialProps = Component.getInitialProps
  StripePage.getPageMeta = Component.getPageMeta

  return StripePage
}




export default withStripe
