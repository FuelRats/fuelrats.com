import TagsInput from '../components/TagsInput'





export default class extends TagsInput {
  static renderLoader () {
    return (
      <span>
        <i className="fa fa-fw fa-pulse fa-spinner" />
        Loading...
      </span>
    )
  }

  static renderValue (rat) {
    const badgeClasses = ['badge', 'platform', 'short', rat.attributes.platform]

    return (
      <span><span className={badgeClasses.join(' ')} /> {rat.attributes.name}</span>
    )
  }

  async search (query) {
    this.setState({ loading: true })

    if (query) {
      const response = await fetch(`/api/rats?limit=10&platform=${this.props['data-platform']}&name.ilike=${query}%`)
      const { data } = await response.json()

      if (!data.length) {
        return this.updateOptions([])
      }

      return this.updateOptions(data)
    }

    return this.updateOptions([])
  }

  static get valueProp () {
    return 'attributes.name'
  }
}
