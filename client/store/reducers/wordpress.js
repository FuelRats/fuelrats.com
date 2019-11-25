import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const wordpressReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_WORDPRESS_PAGE:
    case actionTypes.GET_WORDPRESS_PAGES:
      if (status === 'success') {
        payload.forEach((page) => {
          draftState.pages[page.slug] = page
        })
      }
      break

    default:
      break
  }
}, initialState.rescues)





export default wordpressReducer
