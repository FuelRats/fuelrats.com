const platforms = {
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

export default platforms

export function getPlatform (platform) {
  if (!platform) {
    return platforms.unknown
  }

  return platforms[platform]
}
