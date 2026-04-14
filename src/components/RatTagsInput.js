import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import qs from 'qs'

import TagsInput from './TagsInput'





class RatTagsInput extends TagsInput {
  static renderLoader () {
    return (
      <span>
        <FontAwesomeIcon fixedWidth pulse icon="spinner" />
        {'Loading...'}
      </span>
    )
  }

  renderValue (rat) {
    const platformColors = {
      pc: '#985DB5',
      ps: '#3068B3',
      xb: '#1E8C1E',
    }
    const platformLabels = {
      pc: 'PC',
      ps: 'PS',
      xb: 'XB',
    }
    const platform = rat.attributes?.platform
    if (!platform) {
      return super.renderValue(rat)
    }
    return (
      <span>
        {rat.attributes.name}
        <span
          className="badge"
          style={{ backgroundColor: platformColors[platform] ?? '#555', color: 'white', marginLeft: '0.3em', marginRight: 0, fontSize: '0.75em' }}>
          {platformLabels[platform] ?? platform}
        </span>
      </span>
    )
  }

  async search (query) {
    this.setState({ loading: true })

    const queryParams = qs.stringify({
      page: {
        limit: 10,
      },
      filter: {
        and: [
          { name: { iLike: `${query}%` } },
          { platform: this.props['data-platform'] },
        ],
      },
    })

    if (query) {
      const response = await fetch(`/api/fr/rats?${queryParams}`)
      const { data } = await response.json()

      if (!data?.length) {
        return this.updateOptions([])
      }

      return this.updateOptions(data)
    }

    return this.updateOptions([])
  }
}



export default RatTagsInput
