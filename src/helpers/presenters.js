import { isRequired } from '@fuelrats/validation-util'




export function presentJSONAPIResource (
  type = isRequired('resourceType'),
  data = isRequired('data'),
) {
  const {
    id,
    type: _, // strip type from data if it's given. We will always prefer the predefined type.
    attributes = {},
    relationships,
    links, // API doesn't understand links or meta in resources we send to it, so we strip them here.
    meta,
    ...restAttributes // Interpret all other keys in data as attributes (This is for backwards compatibility with old components)
  } = data

  return {
    type,
    id,
    attributes: {
      ...attributes,
      ...restAttributes,
    },
    relationships,
  }
}

export function presentApiRequestBody (
  type = isRequired('resourceType'),
  data = isRequired('data'),
  documentMeta,
) {
  return {
    data: presentJSONAPIResource(type, data),
    meta: documentMeta,
  }
}
