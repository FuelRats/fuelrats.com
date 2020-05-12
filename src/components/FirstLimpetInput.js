import RatTagsInput from './RatTagsInput'





class FirstLimpetInput extends RatTagsInput {
  // no-op
  search (query) {
    const regex = new RegExp(`.*${query}.*`, 'giu')
    this.updateOptions(this.props.options.filter((option) => {
      return regex.test(this.getValue(option))
    }))
  }
  /* eslint-enable */
}





export default FirstLimpetInput
