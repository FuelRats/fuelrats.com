export default function parseJSONAPIResponseForEntityType (response, type) {
  const propsToParse = ['data', 'included']
  let entities = []

  propsToParse.forEach(prop => {
    if (response[prop]) {
      if (Array.isArray(response[prop])) {
        entities = entities.concat(response[prop].filter(datum => datum.type === type))
      } else if (response[prop].type === type) {
        entities.push(response[prop])
      }
    }
  })

  return entities
}
