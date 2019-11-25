import { produce } from 'immer'





import initialState from '../initialState'
import actionStatus from '../actionStatus'





const dataReducer = ({ data }, { reducer }) => {
  if (reducer) {
    return reducer(data)
  }
  return data.map((item) => item.id)
}





const pageViewsReducer = produce((draftState, action) => {
  const { pageView } = action

  if (action.status === actionStatus.SUCCESS && pageView) {
    const { meta, type } = pageView

    draftState[pageView.id] = {
      data: dataReducer(action.payload, pageView),
      meta,
      type,
    }
  }
}, initialState.pageViews)





export default pageViewsReducer
