import isRequired from '@fuelrats/validation-util/require'

export function presentApiRequestBody (
  type = isRequired('resourceType'),
  data = isRequired('data'),
  documentMeta,
) {
  const {
    id,
    attributes = {},
    relationships,
    links, // API doesn't understand links or meta in resources we send to it, so we strip them here.
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
    meta: documentMeta,
  }
}
