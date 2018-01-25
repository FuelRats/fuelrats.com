import LocalForage from 'localforage'





import TagsInput from './TagsInput'





export default class extends TagsInput {
  static renderLoader () {
    return (
      <span>
        <i className="fa fa-fw fa-pulse fa-spinner" />
        Loading...
      </span>
    )
  }

  /* eslint-disable class-methods-use-this */
  renderValue (rescue) {
  /* eslint-enable class-methods-use-this */
    const operationName = rescue.attributes.title ? `Operation ${rescue.attributes.title}` : null
    const clientDetails = `Rescue of ${rescue.attributes.client || 'unknown'} [${rescue.attributes.platform || 'N/A'}] in ${rescue.attributes.system || 'unknown'}`

    return (
      <span>{rescue.id} ({operationName || clientDetails})</span>
    )
  }

  async search (query) {
    this.setState({ loading: true })

    if (query) {
      try {
        const token = await LocalForage.getItem('access_token')

        let response = await fetch(`/api/rescues/${query}`, {
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        })
        response = await response.json()

        if (response.errors) {
          throw new Error('BadQuery!')
        }

        const { data } = response

        return this.updateOptions(data)
      } catch (error) {
        return this.updateOptions([])
      }
    }
    return this.updateOptions([])
  }
}
