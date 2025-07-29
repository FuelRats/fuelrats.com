const platformList = {
  pc: {
    short: 'PC',
    long: 'PC',
  },
  xb: {
    short: 'XB',
    long: 'Xbox',
  },
  ps: {
    short: 'PS',
    long: 'Playstation',
  },
  unknown: {
    short: '?',
    long: 'Unknown...',
  },
}

export default platformList

export function getPlatform (platform) {
  if (!platform) {
    return platformList.unknown
  }

  return platformList[platform]
}
