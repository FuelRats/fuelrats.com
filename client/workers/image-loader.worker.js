/* eslint-disable no-restricted-globals */

self.addEventListener('message', (event) => {
  event.data.forEach(async ([id, url]) => {
    try {
      const blob = await fetch(url).then((res) => res.blob())

      self.postMessage({
        id,
        payload: URL.createObjectURL(blob),
      })
    } catch (error) {
      self.postMessage({
        id,
        payload: null,
      })
    }
  })
})
