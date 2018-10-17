// export default function parseJSONAPIResponseForEntityType (response, _types, asCollection) {
//  const propsToParse = ['data', 'included']
//  let entities = []
//  let types = _types || []
//
//  if (!Array.isArray(types)) {
//    types = [_types]
//  }
//
//  for (const prop of propsToParse) {
//    if (response[prop]) {
//      if (Array.isArray(response[prop])) {
//        entities = entities.concat(response[prop].filter(datum => types.includes(datum.type)))
//      } else if (types.includes(response[prop].type)) {
//        entities.push(response[prop])
//      }
//    }
//  }
//
//  if (asCollection) {
//    return entities.reduce((collection, datum) => ({
//      ...collection,
//      [datum.id]: datum,
//    }), {})
//  }
//
//  return entities
// }




const parseJSONAPIResponseForEntityType = (response, _types, asCollection) => {
  let types = _types || []

  if (!Array.isArray(types)) {
    types = [_types]
  }

  return ([
    ...(Array.isArray(response.data) ? response.data : [response.data]),
    ...(Array.isArray(response.included) ? response.included : []),
  ]).reduce((acc, entity) => {
    if (types.includes(entity.type)) {
      return asCollection
        ? { ...acc, [entity.id]: entity }
        : [...acc, entity]
    }
    return acc
  }, asCollection ? {} : [])
}


export default parseJSONAPIResponseForEntityType
