/* eslint-disable no-restricted-globals */

self.addEventListener('message', (event) => {
  const imageURL = event.data
  let response = {}

  imageURL.forEach(async (imageData) => {
    response = await fetch(imageData[1])
    const blob = await response.blob()

    self.postMessage({
      id: imageData[0],
      payload: URL.createObjectURL(blob),
    })
  })
})
