// Component imports
import actionStatus from '../store/actionStatus'
import actionTypes from '../store/actionTypes'





// Worker imports
import ImageLoaderWorker from '../workers/image-loader.worker'





let worker = null





export default function getImageLoader (dispatch) {
  if (!worker) {
    worker = new ImageLoaderWorker()
    worker.addEventListener('message', (event) => {
      dispatch({
        type: actionTypes.images.read,
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
