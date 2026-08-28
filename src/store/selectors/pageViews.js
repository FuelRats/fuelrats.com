import { createCachedSelector } from 're-reselect'




const getPageViewId = (_, { pageViewId } = {}) => {
  return pageViewId
}



const selectPageViewById = (state, { pageViewId }) => {
  return state.pageViews[pageViewId]
}


const selectPageViewTargetById = (state, props) => {
  const pageView = selectPageViewById(state, props)
  return pageView && state[pageView.type]
}


export const selectPageViewDataById = createCachedSelector(
  [selectPageViewById, selectPageViewTargetById],
  (pageView, viewTarget) => {
    return pageView && viewTarget && pageView.data.map(((id) => {
      return viewTarget[id]
    }))
  },
)(getPageViewId)


export const selectPageViewMetaById = (state, props) => {
  const pageView = selectPageViewById(state, props)
  return pageView && pageView.meta
}
