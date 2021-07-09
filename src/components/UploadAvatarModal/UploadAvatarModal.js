import PropTypes from 'prop-types'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Cropper from 'react-easy-crop'
import Slider from 'rc-slider';

import asModal, { ModalContent, ModalFooter } from '~/components/asModal'
import getResponseError from '~/helpers/getResponseError'
import { selectCurrentUserId } from '~/store/selectors'
import { updateAvatar } from '~/store/actions/user'
import UploadAvatarMessageBox from './UploadAvatarMessageBox'

// Component Constants
const SUBMIT_AUTO_CLOSE_DELAY_TIME = 3000


function UploadAvatarModal (props) {
  const {
    onClose,
    isOpen,
  } = props

  const [result, setResult] = useState({})

  const [upImg, setUpImg] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0) // Future enhancement, in case we want to add rotation as an option
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [previewImg, setPreviewImg] = useState();
  const [submitReady, setSubmitReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onCropComplete = (croppedArea, cap) => {
    setCroppedAreaPixels(cap)
    setSubmitReady(true);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const dispatch = useDispatch()

  const onSubmit = () => {
    try {
      const image = new Image()
      image.addEventListener('load', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const maxSize = Math.max(image.width, image.height)
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

        // set each dimensions to double largest dimension to allow for a safe area for the
        // image to rotate in without being clipped by canvas context
        canvas.width = safeArea
        canvas.height = safeArea

        // translate canvas context to a central location on image to allow rotating around the center.
        ctx.translate(safeArea / 2, safeArea / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-safeArea / 2, -safeArea / 2)

        // draw rotated image and store data.
        ctx.drawImage(
          image,
          safeArea / 2 - image.width * 0.5,
          safeArea / 2 - image.height * 0.5
        )
        const data = ctx.getImageData(0, 0, safeArea, safeArea)

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = croppedAreaPixels.width
        canvas.height = croppedAreaPixels.height

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(
          data,
          Math.round(0 - safeArea / 2 + image.width * 0.5 - croppedAreaPixels.x),
          Math.round(0 - safeArea / 2 + image.height * 0.5 - croppedAreaPixels.y)
        )

        // Convert the contents of the canvas blob to an image
        const reader = new FileReader()
        canvas.toBlob(blob => {
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            console.log(reader.result)
            let arr = reader.result.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

            while(n--){
              u8arr[n] = bstr.charCodeAt(n);
            }
            console.log(u8arr)
            let croppedImage = new File([u8arr], 'avatar.png', {type:mime});

            if (croppedImage.size > 20*1024*1000) {
              setResult({
                error: { status: 'toobig' },
                success: false,
                submitted: false,
              })
            } else {
              submit(mime, croppedImage);
            }
/*            console.log(croppedImage.size)
            // This is only here for debug
            console.log("Loading preview")
            const reader2 = new FileReader()
            reader2.addEventListener('load', () => setPreviewImg(reader.result))
            reader2.readAsDataURL(croppedImage)
*/
          }
        })
      })
      image.src = upImg

    } catch (e) {
      console.error(e)
      setResult({
        error: { status: 'internal' },
        success: false,
        submitted: false,
      })
    }
  }

  const submit = async (mime, img) => {
    setSubmitting(true);
    const response = await dispatch(updateAvatar(userId, mime, img))
    const error = getResponseError(response)

    setResult({
      error,
      success: !error,
      submitted: true,
    })

    if (!error) {
      setTimeout(() => {
        if (isOpen) {
          onClose()
        }
      }, SUBMIT_AUTO_CLOSE_DELAY_TIME)
    } else {
      setSubmitting(false);
    }
  }

  const userId = useSelector(selectCurrentUserId)

  return (
    <ModalContent className="dialog no-pad">
      <UploadAvatarMessageBox result={result} />
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <div className="crop-container">
        <Cropper
          image={upImg}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(zoom) => { setZoom(zoom); }}
        />
      </div>
      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          <button
            className="green"
            disabled={!submitReady}
            type="submit"
            onClick={onSubmit}>
            { submitting ? 'Uploading' : 'Upload' }
          </button>
        </div>
      </ModalFooter>
    </ModalContent>
  )
}

UploadAvatarModal.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.func.isRequired,
}

export default asModal({
  className: 'upload-avatar-dialog',
  title: 'Upload New Avatar',
})(UploadAvatarModal)
