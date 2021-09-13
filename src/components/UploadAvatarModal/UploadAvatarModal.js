import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { useDispatch } from 'react-redux'

import asModal, { ModalContent, ModalFooter } from '~/components/asModal'
import ProfileUserAvatar from '~/components/ProfileUserAvatar'
import Slider from '~/components/Slider'
import { updateAvatar } from '~/store/actions/user'
import getResponseError from '~/util/getResponseError'

import UploadAvatarMessageBox from './UploadAvatarMessageBox'
import styles from './UploadAvatarModal.module.scss'

// Component Constants
const MAX_FILE_SIZE = 26214400 // Server upload max is 25M
const SUBMIT_AUTO_CLOSE_DELAY_TIME = 3000
const HALF_CIRCLE = 180 // Conversion of rat to deg

// eslint-disable-next-line no-magic-numbers -- Numbers correspond to degree marks to be placed
const rotationMarks = [0, 45, 90, 135, 180].reduce((acc, value) => {
  acc[0 - value] = {}
  acc[value] = {}
  return acc
}, {})

// eslint-disable-next-line no-magic-numbers -- Numbers correspond to zoom marks
const zoomMarks = [1, 1.5, 2, 2.5, 3].reduce((acc, value) => {
  acc[value] = {}
  return acc
}, {})


function UploadAvatarModal (props) {
  const {
    onClose,
    isOpen,
  } = props

  const [result, setResult] = useState({ })

  const [inputDragActive, setInputDragActive] = useState(false)
  const [upImg, setUpImg] = useState()
  // eslint-disable-next-line id-length -- Required by react-easy-crop
  const [crop, handleSetCrop] = useState({ x: 0, y: 0 })
  const [zoom, handleSetZoom] = useState(1)
  const [rotation, handleSetRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [submitReady, setSubmitReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onCropChange = useCallback((croppedArea) => {
    if (!submitting) {
      setSubmitReady(false)
      handleSetCrop(croppedArea)
    }
  }, [submitting])

  const onCropComplete = useCallback((croppedArea, cap) => {
    setCroppedAreaPixels(cap)
    setSubmitReady(true)
  }, [])

  const onSelectFile = useCallback((event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        // eslint-disable-next-line id-length -- Required by react-easy-crop
        handleSetCrop({ x: 0, y: 0 })
        handleSetZoom(1)
        handleSetRotation(0)
        setUpImg(reader.result)
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }, [])

  const dispatch = useDispatch()

  const submit = useCallback(async (img) => {
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

  const onBack = useCallback(() => {
    setUpImg(null)
  }, [])

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
            const [, b64data] = reader.result.split(',')
            const bstr = atob(b64data)
            let datalength = bstr.length
            const u8arr = new Uint8Array(datalength)

            while (datalength > 0) {
              datalength -= 1
              u8arr[datalength] = bstr.charCodeAt(datalength)
            }
            const croppedImage = new File([u8arr], 'avatar.png', { type: 'image/png' })

            if (croppedImage.size > MAX_FILE_SIZE) {
              setResult({
                error: { status: 'toobig' },
                success: false,
                submitted: false,
              })
            } else {
              submit(croppedImage)
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

  const onInputDragEnter = useCallback(() => {
    setInputDragActive(true)
  }, [])
  const onInputDragLeave = useCallback(() => {
    setInputDragActive(false)
  }, [])

  const cropClasses = {
    containerClassName: submitting ? 'disabled' : '',
  }

  return (
    <ModalContent className="dialog no-pad">
      {
        result.success && (
          <div className={styles.avatarPreview}>
            <ProfileUserAvatar />
          </div>
        )
      }
      <UploadAvatarMessageBox className={styles.message} result={result} />
      <div className={styles.body}>
        {
          Boolean(!upImg && !result.success) && (
            <label className={['file-dropzone', { active: inputDragActive }]} htmlFor="avatarInput" id="avatarInputLabel">
              <FontAwesomeIcon fixedWidth icon="file-upload" />
              {' Select Image'}
              <input
                accept="image/png,image/jpeg,image/webp"
                aria-labelledby="avatarInputLabel"
                id="avatarInput"
                type="file"
                onChange={onSelectFile}
                onDragEnter={onInputDragEnter}
                onDragLeave={onInputDragLeave}
                onDrop={onInputDragLeave} />
            </label>
          )
        }
        {
          Boolean(upImg && !result.success) && (
            <div className={styles.zoomAndCrop}>
              <div className={styles.zoomSliderBox}>
                <Slider
                  vertical
                  aria-labelledby="Zoom"
                  disabled={submitting}
                  handleIcon="search"
                  marks={zoomMarks}
                  max={5}
                  min={1}
                  step={0.1}
                  value={zoom}
                  onChange={handleSetZoom} />
              </div>
              <div className={styles.rotateAndCrop}>
                <div className={styles.cropContainer}>
                  <Cropper
                    aspect={1 / 1}
                    classes={cropClasses}
                    crop={crop}
                    cropShape="round"
                    image={upImg}
                    rotation={rotation}
                    zoom={zoom}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onZoomChange={handleSetZoom} />
                </div>
                <div className={styles.rotateSliderBox}>
                  <Slider
                    aria-labelledby="Rotation"
                    disabled={submitting}
                    handleIcon="sync"
                    marks={rotationMarks}
                    max={180}
                    min={-180}
                    startPoint={0}
                    step={5}
                    value={rotation}
                    onChange={handleSetRotation} />

                </div>
              </div>
            </div>
          )
        }
      </div>

      {
        !result.success && (
          <ModalFooter>
            <div className="secondary">
              {
                upImg && (
                  <button
                    className="secondary"
                    disabled={submitting}
                    type="button"
                    onClick={onBack}>
                    {'Back'}
                  </button>
                )
              }
            </div>
            <div className="primary">
              <button
                className="green"
                disabled={submitting || !submitReady}
                type="submit"
                onClick={onSubmit}>
                {submitting ? 'Uploading' : 'Upload'}
              </button>
            </div>
          </ModalFooter>
        )
      }
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
