import TagsInput from '../components/TagsInput'





export default class extends TagsInput {
  search (query) {
    if (query) {

//      fetch(`/api/autocomplete?limit=10&name=${query}`)
//      .then(response => response.json())
//      .then(response => {
//        if (!response) {
//          return this.updateOptions([])
//        }
//
//        this.updateOptions(response.data.map(model => {
//          return {
//            id: model.id,
//            value: model.CMDRname
//          }
//        }))
//      })
    }
  }
}
