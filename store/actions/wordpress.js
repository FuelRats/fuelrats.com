// Component imports
import { createWpAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getWordpressPage = slug => createWpAction({
  actionType: actionTypes.GET_WORDPRESS_PAGE,
  url: '/pages',
  params: {
    slug,
  },
})
