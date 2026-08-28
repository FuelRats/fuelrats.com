export function isValidUuidV4 (uuidToTest) {
  if (typeof uuidToTest !== 'string') {
    return false
  }
  return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/ui.test(uuidToTest)
}
