// Component imports
import { createWpAction } from '../actionCreators'
import actionTypes from '../actionTypes'




/* eslint-disable import/prefer-default-export */
// prefer export member for consistency
export const getWordpressPage = (slug) => createWpAction({
  actionType: actionTypes.GET_WORDPRESS_PAGE,
  url: '/pages',
  params: {
    slug,
  },
  onSuccess: (res) => {
    if (res.data && !res.data.length) {
      throw new Error('No page in response')
    }
  },
})
