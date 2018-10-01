// Module imports
import TagsInput from './TagsInput'





// Component imports
import countryList from '../data/CountryList'





export default class extends TagsInput {
  search (_query) {
    const query = _query.toLowerCase()
    if (query) {
      const response = countryList.filter(country => country.toLowerCase().startsWith(query.toLowerCase()))

      if (query.startsWith('us')) {
        response.unshift('United States Minor Outlying Islands')
        response.unshift('United States')
      }

      if (query === 'uk') {
        response.unshift('United Kingdom')
      }

      if (query.startsWith('ua')) {
        response.unshift('United Arab Emirates')
      }

      this.updateOptions(response.slice(0, 5))
    }
  }
}
