const platformList = {
  pc: {
    short: 'PC',
    long: 'PC',
  },
  xb: {
    short: 'XB1',
    long: 'Xbox One',
  },
  ps: {
    short: 'PS4',
    long: 'Playstation 4',
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
