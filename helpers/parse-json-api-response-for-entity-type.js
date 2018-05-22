export default function parseJSONAPIResponseForEntityType (response, _types, asCollection) {
  const propsToParse = ['data', 'included']
  let entities = []
  let types = _types || []

  if (!Array.isArray(types)) {
    types = [_types]
  }

  for (const prop of propsToParse) {
    if (response[prop]) {
      if (Array.isArray(response[prop])) {
        entities = entities.concat(response[prop].filter(datum => types.includes(datum.type)))
      } else if (types.includes(response[prop].type)) {
        entities.push(response[prop])
      }
    }
  }

  if (asCollection) {
    return entities.reduce((collection, datum) => ({ ...collection, [datum.id]: datum }), {})
  }

  return entities
}
