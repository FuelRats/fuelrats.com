import isRequired from './isRequired'

export function presentApiRequestBody (type = isRequired('resourceType'), data = isRequired('data')) {
  const {
    id,
    attributes = {},
    relationships,
    links,
    meta,
    ...restAttributes
  } = data

  return {
    data: {
      type: data.type ?? type,
      id,
      attributes: {
        ...attributes,
        ...restAttributes,
      },
      relationships,
    },
  }
}
