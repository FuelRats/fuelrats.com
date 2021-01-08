import { createSelector } from 'reselect'





import { selectUserById } from './users'



export const getRatId = (_, { ratId } = {}) => {
  return ratId
}

export const selectRats = (state) => {
  return state.rats
}


export const selectRatById = (state, { ratId }) => {
  return state.rats[ratId]
}


export const selectRatsByUserId = createSelector(
  [selectUserById, selectRats],
  (user, rats) => {
    return user?.relationships.rats.data?.map(({ id }) => {
      return rats[id]
    }) ?? undefined
  },
)


export const selectDisplayRatIdByUserId = createSelector(
  [selectUserById],
  (user) => {
    if (!user) {
      return undefined
    }

    return user.relationships.displayRat?.data?.id
      ?? user.relationships.rats?.data[0]?.id
      ?? undefined
  },
)


export const selectDisplayRatByUserId = (state, props) => {
  return selectRatById(
    state,
    {
      ratId: selectDisplayRatIdByUserId(state, props),
    },
  )
}
