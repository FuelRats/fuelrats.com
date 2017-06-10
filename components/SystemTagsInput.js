import TagsInput from '../components/TagsInput'





export default class extends TagsInput {
  search (query) {
    if (query) {
      fetch(`/edsm-api/typeahead/systems/query/${query}`)
      .then(response => response.json())
      .then(response => {
        if (!response) {
          return this.updateOptions([])
        }

        this.updateOptions(response)
      })
    }
  }
}
