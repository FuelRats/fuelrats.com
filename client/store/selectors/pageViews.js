import { createSelector } from 'reselect'





const selectPageViewById = (state, { pageViewId }) => state.pageViews[pageViewId]


const selectPageViewTargetById = (state, props) => {
  const pageView = selectPageViewById(state, props)
  return pageView && state[pageView.type]
}


const selectPageViewDataById = createSelector(
  [selectPageViewById, selectPageViewTargetById],
  (pageView, viewTarget) => pageView && viewTarget && pageView.data.map(((id) => viewTarget[id])),
)

const selectPageViewMetaById = (state, props) => {
  const pageView = selectPageViewById(state, props)
  return pageView && pageView.meta
}





export {
  selectPageViewDataById,
  selectPageViewMetaById,
}
