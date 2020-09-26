import actionTypes from '~/store/actionTypes'
import ImageLoaderWorker from '~/workers/image-loader.worker'





let worker = null





const getImageLoader = (dispatch) => {
  if (!worker) {
    worker = new ImageLoaderWorker()
    worker.addEventListener('message', (event) => {
      dispatch({
        type: actionTypes.images.read,
        error: !event.data.payload,
        payload: event.data.payload,
        meta: {
          id: event.data.id,
        },
      })
    })
    window.addEventListener('beforeunload', () => {
      worker.terminate()
    })
  }

  return worker
}





export default getImageLoader
