import env from '../../.config/env'

let clientConfig = null

// Name of the meta element `_document` renders the public config into
export const PUBLIC_CONFIG_META_NAME = 'fr-public-config'

/**
 * Runtime configuration that is safe to expose to the browser. Values are read from the server's environment at
 * request time, so a single build can serve multiple deployments.
 * @returns {object} Public runtime configuration.
 */
export default function getPublicConfig () {
  if (typeof window === 'undefined') {
    return {
      frSocketUrl: env.frapi.socket,
      stripeApiPk: env.stripe.public,
      ircClientUrl: env.irc.client,
      ircRatUrl: env.irc.rat,
      vapidPublicKey: env.vapid.publicKey,
    }
  }

  if (!clientConfig) {
    const configJson = document.querySelector(`meta[name="${PUBLIC_CONFIG_META_NAME}"]`)?.content
    clientConfig = configJson ? JSON.parse(configJson) : {}
  }

  return clientConfig
}
