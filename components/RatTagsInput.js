import TagsInput from '../components/TagsInput'





export default class extends TagsInput {
  renderValue (rat) {
    let badgeClasses = ['badge', 'platform', 'short', rat.attributes.platform]

    return (
      <span><span className={badgeClasses.join(' ')} /> {rat.attributes.name}</span>
    )
  }

  async search (query) {
    if (query) {
      let response = await fetch(`/api/rats?limit=10&platform=${this.props['data-platform']}&name.ilike=${query}%`)
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
