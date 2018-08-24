import RatTagsInput from './RatTagsInput'





export default class extends RatTagsInput {
  /* eslint-disable class-methods-use-this */
  // no-op
  search (query) {
    const regex = new RegExp(`.*${query}.*`, 'gi')
    this.updateOptions(this.props.options.filter(option => regex.test(this.getValue(option))))
  }
  /* eslint-enable */
}
