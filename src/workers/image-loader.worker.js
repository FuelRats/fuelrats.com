self.addEventListener('message', async (event) => {
  try {
    const {
      id,
      url,
    } = event.data

    const blob = await fetch(url).then((res) => {
      return res.blob()
    })

    self.postMessage({
      id,
      payload: URL.createObjectURL(blob),
    })
  } catch (error) {
    self.postMessage({
      id: event.data.id || 'bad-image',
      payload: null,
    })
  }
})
