export default function parseJSONAPIResponseForEntityType (response, type) {
  let entities = []
  let propsToParse = ['data', 'included']

  propsToParse.forEach(prop => {
    if (response[prop]) {
      if (Array.isArray(response[prop])) {
        entities = entities.concat(response[prop].filter(datum => datum.type === type))

      } else {
        if (response[prop].type === type) {
          entities.push(response[prop])
        }
      }
    }
  })

  return entities
}
