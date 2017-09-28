import TagsInput from '../components/TagsInput'





export default class extends TagsInput {
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
