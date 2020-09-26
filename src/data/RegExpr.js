export const commanderPattern = '^[\x00-\x7F]+$'
export const ircNickPattern = '^[A-Za-z_\\\\`\\[\\]{}]([A-Za-z0-9_\\\\`\\[\\]{}\\-|]{1,29})?$'
export const ircNickRegExp = new RegExp(ircNickPattern, 'u')
export const passwordPattern = '^[^\\s]{5,42}$'
