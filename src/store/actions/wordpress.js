import { createAxiosFSA } from '@fuelrats/web-util/actions'

import wpApi from '~/services/wordpress'

import actionTypes from '../actionTypes'





// prefer export member for consistency
export const getWordpressPage = (slug) => {
  return async (dispatch) => {
    const action = createAxiosFSA(
      actionTypes.wordpress.pages.read,
      await wpApi.request({
        url: '/pages',
        params: {
          slug,
        },
      }),
    )

    return dispatch({
      ...action,
      error: action.error || !action.payload?.length,
    })
  }
}
