import isRequired from './isRequired'

const parseJSONAPIResponseForEntityType = (
  response = isRequired('response'),
  _types = isRequired('types'),
  asCollection = false
) => {
  const types = Array.isArray(_types) ? _types : [_types]

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
