// This information is PUBLIC. all env values are explicitly defined to prevent secret leakage.
// DO NOT BLINDLY DEFINE OBJECTS! I.E. `frapi: env.frapi,`
module.exports = (env) => {
  return {
    appUrl: env.appUrl,
    frapi: {
      url: env.frapi.proxy,
      server: env.frapi.url,
      socket: env.frapi.socket,
    },
    edsm: {
      url: env.edsm.proxy,
    },
    wordpress: {
      url: env.wordpress.proxy,
    },
    stripe: {
      url: env.stripe.url,
      public: env.stripe.public,
    },
    irc: {
      client: env.irc.client,
      rat: env.irc.rat,
    },
  }
}
