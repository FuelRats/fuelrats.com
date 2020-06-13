const deepMergeResource = (target, source) => {
  if (target.id !== source.id || target.type !== source.type) {
    return target
  }

  if (source.attributes) {
    if (target.attributes) {
      Object.keys(source.attributes).forEach((key) => {
        if (target.attributes[key] !== source.attributes[key]) {
          target.attributes[key] = source.attributes[key]
        }
      })
    } else {
      target.attributes = { ...source.attributes }
    }
  }

  if (source.relationships) {
    if (target.relationships) {
      Object.keys(source.relationships).forEach((key) => {
        target.relationships[key] = source.relationships[key]
      })
    } else {
      target.relationships = { ...source.relationships }
    }
  }

  if (source.meta) {
    if (target.meta) {
      Object.keys(source.meta).forEach((key) => {
        if (target.meta[key] !== source.meta[key]) {
          target.meta[key] = source.meta[key]
        }
      })
    } else {
      target.meta = { ...source.meta }
    }
  }

  return target
}





export default deepMergeResource
