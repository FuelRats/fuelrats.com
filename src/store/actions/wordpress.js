// Component imports
import { createAxiosFSA } from '@fuelrats/web-util/actions'





import actionTypes from '../actionTypes'
import wpApi from '~/services/wordpress'





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
