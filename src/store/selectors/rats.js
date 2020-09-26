import { createSelector } from 'reselect'





import { selectUserById } from './users'





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
    }) || null
  },
)


export const selectDisplayRatIdByUserId = createSelector(
  [selectUserById],
  (user) => {
    if (!user) {
      return null
    }

    return user.relationships.displayRat?.data?.id
      ?? user.relationships.rats?.data[0]?.id
      ?? null
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
