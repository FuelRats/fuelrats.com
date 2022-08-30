import RadioInput from '~/components/RadioInput'
import { expansionNameMap } from '~/util/expansion'


const expansionOptions = Object.entries(expansionNameMap).map(([value, label]) => {
  return {
    value,
    label,
  }
})



function ExpansionRadioInput (props) {
  return (
    <RadioInput
      {...props}
      options={expansionOptions} />
  )
}





export default ExpansionRadioInput
