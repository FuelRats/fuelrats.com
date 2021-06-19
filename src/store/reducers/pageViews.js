import { isError } from 'flux-standard-action'
import { produce } from 'immer'





import initialState from '../initialState'





const dataReducer = ({ data }, { reducer }) => {
  if (reducer) {
    return reducer(data)
  }

  return data.map((item) => {
    return item.id
  })
}





export default produce((draftState, action) => {
  const { meta, payload } = action

  if (!isError(action) && meta?.pageView) {
    const { pageView } = meta
    draftState[meta.pageView.id] = {
      data: dataReducer(action.payload, pageView),
      meta: payload.meta,
      type: pageView.type,
    }
  }
}, initialState.pageViews)
