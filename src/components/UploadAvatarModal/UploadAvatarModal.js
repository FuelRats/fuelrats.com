import PropTypes from 'prop-types'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Cropper from 'react-easy-crop'
import Slider from 'rc-slider'

import asModal, { ModalContent, ModalFooter } from '~/components/asModal'
import getResponseError from '~/util/getResponseError'
import { selectCurrentUserId } from '~/store/selectors'
import { updateAvatar } from '~/store/actions/user'
import UploadAvatarMessageBox from './UploadAvatarMessageBox'

import styles from './UploadAvatarModal.module.scss'

// Component Constants
const MAX_FILE_SIZE = 20971520
const SUBMIT_AUTO_CLOSE_DELAY_TIME = 3000


function UploadAvatarModal (props) {
  const {
    onClose,
    isOpen,
  } = props

  const [result, setResult] = useState({})

  const [upImg, setUpImg] = useState()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0) // Future enhancement, in case we want to add rotation as an option
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [submitReady, setSubmitReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onCropComplete = (croppedArea, cap) => {
    setCroppedAreaPixels(cap)
    setSubmitReady(true)
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setUpImg(reader.result))
      reader.readAsDataURL(e.target.files[0])
    }
  }

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
            u8arr = new Uint8Array(n)

            while(n--){
              u8arr[n] = bstr.charCodeAt(n)
            }
            console.log(u8arr)
            let croppedImage = new File([u8arr], 'avatar.png', {type:mime})

            console.log(croppedImage.size)
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
    setSubmitting(true)
    const response = await dispatch(updateAvatar(userId, img))
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
      setSubmitting(false)
    }
  }

  const userId = useSelector(selectCurrentUserId)

  return (
    <ModalContent className="dialog no-pad">
      <UploadAvatarMessageBox result={result} />
      <div>
        <label>Select Image: </label>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <div class={styles.zoomAndCrop}>
        <div class={styles.zoomSliderBox}>
          <div class={styles.zoomSliderIcon}>
            <FontAwesomeIcon icon="search-plus" />
          </div>
          <div class={styles.sliderControl}>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              vertical={true}
              aria-labelledby="Zoom"
              onChange={(zoom) => { setZoom(zoom) }}
            />
          </div>
          <div class={styles.zoomSliderIcon}>
            <FontAwesomeIcon icon="search-minus" />
          </div>
        </div>
        <div class={styles.rotateAndCrop}>
            <div class={styles.cropContainer}>
              <Cropper
                image={upImg}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1 / 1}
                cropShape={'round'}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
          </div>
          <div className={styles.rotateSliderBox}>
            <div class={styles.rotateSliderIcon}>
              <FontAwesomeIcon icon="undo" />
            </div>
            <div class={styles.sliderControl}>
              <Slider
              value={rotation}
              min={-180}
              max={180}
              step={1}
              aria-labelledby="Rotation"
              onChange={(rotation) => { setRotation(rotation) }}
              />
            </div>
            <div class={styles.rotateSliderIcon}>
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
