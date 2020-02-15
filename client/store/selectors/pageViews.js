import { createSelector } from 'reselect'





const selectPageViewById = (state, { pageViewId }) => {
  return state.pageViews[pageViewId]
}


const selectPageViewTargetById = (state, props) => {
  const pageView = selectPageViewById(state, props)
  return pageView && state[pageView.type]
}


export const selectPageViewDataById = createSelector(
  [selectPageViewById, selectPageViewTargetById],
  (pageView, viewTarget) => {
    return pageView && viewTarget && pageView.data.map(((id) => {
      return viewTarget[id]
    }))
  },
)


export const selectPageViewMetaById = (state, props) => {
  const pageView = selectPageViewById(state, props)
  return pageView && pageView.meta
}
