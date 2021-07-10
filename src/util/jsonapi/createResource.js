import { isRequired } from '@fuelrats/validation-util'

export default function createResource (reqType, data) {
  let {
    id = isRequired('id'),
    type = isRequired('type'),
    attributes,
    relationships,
    links,
    meta,
    ...restAttributes
  } = data

  if (reqType && reqType !== type) {
    throw new Error('Route attempted to respond with mismatched data types')
  }

  if (attributes && Object.keys(restAttributes).length) {
    attributes = { ...restAttributes, ...attributes }
  }

  return {
    id,
    type,
    attributes,
    relationships,
    links,
    meta,
  }
}
