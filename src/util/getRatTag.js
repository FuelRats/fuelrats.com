const getRatTag = (rat) => {
  return `${rat.attributes.name} [${rat.attributes.platform.toUpperCase()}]`
}





export default getRatTag
