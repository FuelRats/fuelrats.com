import RatTagsInput from './RatTagsInput'





class FirstLimpetInput extends RatTagsInput {
  /* eslint-disable class-methods-use-this */
  // no-op
  search (query) {
    const regex = new RegExp(`.*${query}.*`, 'giu')
    this.updateOptions(this.props.options.filter((option) => regex.test(this.getValue(option))))
  }
  /* eslint-enable */
}





export default FirstLimpetInput
