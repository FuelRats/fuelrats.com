// Component imports
import wpApi from '../../services/wordpress'
import actionStatus from '../actionStatus'
import actionTypes from '../actionTypes'
import { createAxiosAction } from './services'





/* eslint-disable import/prefer-default-export */
// prefer export member for consistency
export const getWordpressPage = (slug) => {
  return async (dispatch) => {
    const response = await wpApi.request({
      url: '/pages',
      params: {
        slug,
      },
    })

    return dispatch({
      ...createAxiosAction(actionTypes.wordpress.pages.read, response),
      status: response.data && response.data.length ? actionStatus.SUCCESS : actionStatus.ERROR,
    })
  }
}
