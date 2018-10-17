// Module imports
import TagsInput from './TagsInput'





class SystemTagsInput extends TagsInput {
  async search (query) {
    if (query) {
      let response = await fetch(`/edsm-api/typeahead/systems/query/${query}`)
      response = await response.json()

      if (!response) {
        response = []
      }

      this.updateOptions(response)
    }
  }
}



export default SystemTagsInput
