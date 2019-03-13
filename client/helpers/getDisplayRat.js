const getDisplayRat = (user, ratState) => {
  let { displayRatId } = user.attributes

  const rats = user.relationships.rats.data.reduce((acc, { id }) => ({
    ...acc,
    [id]: ratState[id],
  }), {})

  if (!displayRatId && user.relationships.rats.data.length > 0) {
    displayRatId = user.relationships.rats.data[0].id
  }

  return displayRatId ? rats[displayRatId] : null
}





export default getDisplayRat
