import ip6addr from 'ip6addr'
import jsonfile from 'jsonfile'
import { stat } from 'node:fs/promises'


import { UnauthorizedAPIError } from '~/util/server/errors'
import getEnv from '~/util/server/getEnv'


const IPV4_PREFIX_LENGTH = 32
const IPV6_PREFIX_LENGTH = 56
const env = getEnv()

let bansCache = null

// Parses the bans file only when it has changed since it was last read.
async function readBansFile (path) {
  const { mtimeMs } = await stat(path)
  if (bansCache?.mtimeMs !== mtimeMs) {
    bansCache = { mtimeMs, bans: await jsonfile.readFile(path) }
  }

  return bansCache.bans
}

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

function ipFilter () {
  return async (ctx, next) => {
  // We only care about checking the file if it's actually configured
    if (env.stripe?.bansFile) {
      const bansFile = await readBansFile(env.stripe.bansFile)
      const bansList = bansFile[getIpType(ctx.req.ip)] ?? []


      const isBanned = bansList.find(compareIps(ctx.req.ip))

      if (isBanned) {
        throw new UnauthorizedAPIError()
      }
    }

    await next()
  }
}





export default ipFilter
