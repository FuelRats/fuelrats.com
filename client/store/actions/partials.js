/*
 * This file contains functions which return a partial action. These should not be used outside action creators
 */





export const getResourceDeletePartial = (type, id) => ({
  payload: {
    data: {
      type,
      id,
    },
  },
})


export const getPageViewPartial = (type, viewName) => ({
  pageView: viewName && {
    id: viewName,
    type,
  },
})
