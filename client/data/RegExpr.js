const commanderPattern = '^[\x00-\x7F]+$'
const commanderRegex = new RegExp(commanderPattern, 'u')





const ircNickPattern = '^[A-Za-z[\\\\\\]^_`{|}]{1}[-0-9A-Za-z[\\\\\\]^_`{|}]{0,29}$'
const ircNickRegex = new RegExp(ircNickPattern, 'u')





const passwordPattern = '^[^\\s]{5,42}$'
const passwordRegex = new RegExp(passwordPattern, 'u')





export {
  commanderPattern,
  commanderRegex,
  ircNickPattern,
  ircNickRegex,
  passwordPattern,
  passwordRegex,
}
