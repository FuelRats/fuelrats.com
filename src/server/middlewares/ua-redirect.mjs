import { UAParser } from 'ua-parser-js'





export default function uaRedirect (browsers, target) {
  return async (ctx, next) => {
    const agent = new UAParser(ctx.header['user-agent'])

    if (agent) {
      const agentBrowser = agent.getBrowser()
      const browserResolver = browsers[agentBrowser.name]
      if (typeof browserResolver !== 'undefined') {
        const isIncompatible = typeof browserResolver === 'function'
          ? browserResolver(agent)
          : browserResolver

        if (isIncompatible) {
          ctx.redirect(target)
          return
        }
      }
    }


    await next()
  }
}
