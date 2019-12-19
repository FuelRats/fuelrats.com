import imageLoader from '../../services/imageLoader'
import actionTypes from '../actionTypes'





const getImage = (payload) => (dispatch) => {
  imageLoader(dispatch).postMessage(payload)
}





const disposeImage = ({ id, url }) => (dispatch) => {
  window.URL.revokeObjectURL(url)

  return dispatch({
    type: actionTypes.images.dispose,
    status: 'success',
    payload: id,
  })
}





export {
  getImage,
  disposeImage,
}
