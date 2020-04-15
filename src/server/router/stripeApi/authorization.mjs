import ip6addr from 'ip6addr'
import jsonfile from 'jsonfile'


import { UnauthorizedError } from './error'

const IPV4_PREFIX_LENGTH = 32
const IPV6_PREFIX_LENGTH = 56

const getIpType = (ip) => {
  return ip6addr.parse(ip).kind()
}

const compareIps = (userIp) => {
  let defaultPrefixLength = IPV4_PREFIX_LENGTH

  if (getIpType(userIp) === 'ipv6') {
    defaultPrefixLength = IPV6_PREFIX_LENGTH
  }

  return (_bannedIp) => {
    let bannedIp = _bannedIp

    if (!bannedIp.includes('/')) { // If banned ip does not have a defined prefix length
      bannedIp = `${bannedIp}/${defaultPrefixLength}`
    }

    const isMatch = ip6addr.createCIDR(bannedIp).contains(userIp)

    return isMatch
  }
}

const authorizeUser = async (ctx, next) => {
  // We only care about checking the file if it's actually configured
  if (ctx.state.env?.stripe?.bansFile) {
    // Load on every request since we don't want to
    const bansFile = await jsonfile.readFile(ctx.state.env.stripe.bansFile)
    const bansList = bansFile[getIpType(ctx.ip)] ?? []


    const isBanned = bansList.find(compareIps(ctx.ip))

    if (isBanned) {
      throw new UnauthorizedError()
    }
  }

  await next()
}





export default authorizeUser
