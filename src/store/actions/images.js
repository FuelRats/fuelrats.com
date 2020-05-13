import actionTypes from '../actionTypes'
import imageLoader from '~/services/imageLoader'





export const getImage = (payload) => {
  return (dispatch) => {
    imageLoader(dispatch).postMessage(payload)
  }
}

export const disposeImage = ({ id, url }) => {
  return (dispatch) => {
    window.URL.revokeObjectURL(url)

    return dispatch({
      type: actionTypes.images.dispose,
      status: 'success',
      payload: id,
    })
  }
}
