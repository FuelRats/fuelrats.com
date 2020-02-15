import { produce } from 'immer'





import actionStatus from '../actionStatus'
import initialState from '../initialState'





const dataReducer = ({ data }, { reducer }) => {
  if (reducer) {
    return reducer(data)
  }
  return data.map((item) => {
    return item.id
  })
}





const pageViewsReducer = produce((draftState, action) => {
  const { pageView, payload } = action

  if (action.status === actionStatus.SUCCESS && pageView) {
    draftState[pageView.id] = {
      data: dataReducer(action.payload, pageView),
      meta: payload.meta,
      type: pageView.type,
    }
  }
}, initialState.pageViews)





export default pageViewsReducer
