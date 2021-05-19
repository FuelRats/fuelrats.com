import actionTypes from '~/store/actionTypes'




let worker = null





const getImageLoader = (dispatch) => {
  if (!worker) {
    worker = new Worker(new URL('../workers/image-loader.worker.js', import.meta.url))
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
