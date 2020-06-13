/*
 * This file contains functions which return a partial action. These should not be used outside action creators
 */

export const getPageViewPartial = (type, viewName) => {
  return {
    pageView: viewName && {
      id: viewName,
      type,
    },
  }
}
