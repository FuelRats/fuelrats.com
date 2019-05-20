import initialState from '../initialState'
import actionStatus from '../actionStatus'





const dataReducer = (data, opts) => {
  if (opts.reducer) {
    return opts.reducer(data)
  }

  return data.map((item) => item.id)
}





export default function pageViewsReducer (state = initialState.pageViews, action) {
  const {
    payload,
    status,
    pageView,
  } = action



  if (status === actionStatus.SUCCESS && pageView) {
    return {
      ...state,
      [pageView.id]: {
        type: pageView.type,
        data: dataReducer(payload.data, pageView),
        meta: { ...payload.meta },
      },
    }
  }


  return state
}
