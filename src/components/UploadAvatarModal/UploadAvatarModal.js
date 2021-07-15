import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { useDispatch } from 'react-redux'

import asModal, { ModalContent, ModalFooter } from '~/components/asModal'
import { updateAvatar } from '~/store/actions/user'
import getResponseError from '~/util/getResponseError'

import UploadAvatarMessageBox from './UploadAvatarMessageBox'
import styles from './UploadAvatarModal.module.scss'

// Component Constants
const MAX_FILE_SIZE = 26214400 // Server upload max is 25M
const SUBMIT_AUTO_CLOSE_DELAY_TIME = 3000
const HALF_CIRCLE = 180 // Conversion of rat to deg
const TRIM_DATA = 5


function UploadAvatarModal (props) {
  const {
    onClose,
    isOpen,
  } = props

  const [result, setResult] = useState({})

  const [upImg, setUpImg] = useState()
  // eslint-disable-next-line id-length -- Required by react-easy-crop
  const [crop, handleSetCrop] = useState({ x: 0, y: 0 })
  const [zoom, handleSetZoom] = useState(1)
  const [rotation, handleSetRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [submitReady, setSubmitReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onCropComplete = useCallback((croppedArea, cap) => {
    setCroppedAreaPixels(cap)
    setSubmitReady(true)
  }, [])

  const onSelectFile = useCallback((event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        return setUpImg(reader.result)
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }, [])

  const dispatch = useDispatch()

  const submit = useCallback(async (mime, img) => {
    setSubmitting(true)
    const response = await dispatch(updateAvatar(img))
    const error = getResponseError(response)

    setResult({
      error,
      success: !error,
      submitted: true,
    })

    if (error) {
      setSubmitting(false)
    } else {
      setTimeout(() => {
        if (isOpen) {
          onClose()
        }
      }, SUBMIT_AUTO_CLOSE_DELAY_TIME)
    }
  }, [dispatch, isOpen, onClose])

  const onSubmit = useCallback(() => {
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
        ctx.rotate((rotation * Math.PI) / HALF_CIRCLE)
        ctx.translate(-safeArea / 2, -safeArea / 2)

        // draw rotated image and store data.
        ctx.drawImage(
          image,
          safeArea / 2 - image.width / 2,
          safeArea / 2 - image.height / 2,
        )
        const data = ctx.getImageData(0, 0, safeArea, safeArea)

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = croppedAreaPixels.width
        canvas.height = croppedAreaPixels.height

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(
          data,
          Math.round(0 - safeArea / 2 + image.width / 2 - croppedAreaPixels.x),
          Math.round(0 - safeArea / 2 + image.height / 2 - croppedAreaPixels.y),
        )

        // Convert the contents of the canvas blob to an image
        const reader = new FileReader()
        canvas.toBlob((blob) => {
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            let start = 0
            let mimeend = 0
            let datastart = 0
            if (reader.result.indexOf('data:') === 0) {
              start = TRIM_DATA
            }
            mimeend = reader.result.indexOf(';', start)
            datastart = reader.result.indexOf(',', mimeend)
            const mime = reader.result.substring(start, mimeend)
            const b64data = reader.result.substr(datastart + 1)
            const bstr = atob(b64data)
            let datalength = bstr.length
            const u8arr = new Uint8Array(datalength)

            while (datalength > 0) {
              datalength -= 1
              u8arr[datalength] = bstr.charCodeAt(datalength)
            }
            const croppedImage = new File([u8arr], 'avatar.png', { type: mime })

            if (croppedImage.size > MAX_FILE_SIZE) {
              setResult({
                error: { status: 'toobig' },
                success: false,
                submitted: false,
              })
            } else {
              submit(mime, croppedImage)
            }
          }
        })
      })
      image.src = upImg
    } catch (exception) {
      console.error(exception)
      setResult({
        error: { status: 'internal' },
        success: false,
        submitted: false,
      })
    }
  }, [croppedAreaPixels, rotation, submit, upImg])

  return (
    <ModalContent className="dialog no-pad">
      <UploadAvatarMessageBox result={result} />
      <div>
        <label>{'Select Image: '}</label>
        <input accept="image/*" aria-label="Select Image" type="file" onChange={onSelectFile} />
      </div>
      <div className={styles.zoomAndCrop}>
        <div className={styles.zoomSliderBox}>
          <div className={styles.zoomSliderIcon}>
            <FontAwesomeIcon icon="search-plus" />
          </div>
          <div className={styles.sliderControl}>
            <Slider
              vertical
              aria-labelledby="Zoom"
              max={3}
              min={1}
              step={0.1}
              value={zoom}
              onChange={handleSetZoom} />
          </div>
          <div className={styles.zoomSliderIcon}>
            <FontAwesomeIcon icon="search-minus" />
          </div>
        </div>
        <div className={styles.rotateAndCrop}>
          <div className={styles.cropContainer}>
            <Cropper
              aspect={1 / 1}
              crop={crop}
              cropShape="round"
              image={upImg}
              rotation={rotation}
              zoom={zoom}
              onCropChange={handleSetCrop}
              onCropComplete={onCropComplete}
              onZoomChange={handleSetZoom} />
          </div>
          <div className={styles.rotateSliderBox}>
            <div className={styles.rotateSliderIcon}>
              <FontAwesomeIcon icon="undo" />
            </div>
            <div className={styles.sliderControl}>
              <Slider
                aria-labelledby="Rotation"
                max={180}
                min={-180}
                step={1}
                value={rotation}
                onChange={handleSetRotation} />
            </div>
            <div className={styles.rotateSliderIcon}>
              <FontAwesomeIcon icon="redo" />
            </div>
          </div>
        </div>
      </div>
      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          <button
            className="green"
            disabled={!submitReady}
            type="submit"
            onClick={onSubmit}>
            {submitting ? 'Uploading' : 'Upload'}
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
