// Component imports
import actionTypes from '../store/actionTypes'





// Worker imports
import actionStatus from '../store/actionStatus'
import ImageLoaderWorker from '../workers/image-loader.worker'





let worker = null





export default function getImageLoader (dispatch) {
  if (!worker) {
    worker = new ImageLoaderWorker()
    worker.addEventListener('message', (event) => {
      dispatch({
        type: actionTypes.GET_IMAGE,
        status: actionStatus.SUCCESS,
        ...event.data,
      })
    })
    window.addEventListener('beforeunload', () => {
      worker.terminate()
    })
  }

  return worker
}
