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
