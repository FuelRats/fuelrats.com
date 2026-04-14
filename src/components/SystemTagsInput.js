import TagsInput from './TagsInput'





class SystemTagsInput extends TagsInput {
  async search (query) {
    if (query) {
      this.setState({ loading: true })
      try {
        const response = await fetch(`/api/sapi/mecha?name=${encodeURIComponent(query)}`)
        if (!response.ok) {
          this.updateOptions([])
          return
        }
        const json = await response.json()
        const systems = json?.data?.map((system) => {
          return system.name
        }) ?? []
        this.updateOptions(systems)
      } catch {
        this.updateOptions([])
      }
    }
  }
}



export default SystemTagsInput
