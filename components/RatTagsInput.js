import TagsInput from '../components/TagsInput'





export default class extends TagsInput {
  renderValue (rat) {
    return `<div class="badge platform short ${rat.attributes.platform}"></div> ${rat.attributes.name}`
  }

  async search (query) {
    if (query) {
      let response = await fetch(`/api/rats?limit=10&name.ilike=${query}%`)
      let {
        data,
      } = await response.json()

      if (!data.length) {
        return this.updateOptions([])
      }

      return this.updateOptions(data)
    }

    this.updateOptions([])
  }

  get valueProp () {
    return 'attributes.name'
  }
}
