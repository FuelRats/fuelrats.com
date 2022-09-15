import RadioInput from '~/components/RadioInput'
import { expansionLongRadioOptions, expansionRadioOptions } from '~/util/expansion'


export default function ExpansionRadioInput ({ longNames = false, ...props }) {
  return (
    <RadioInput
      {...props}
      options={longNames ? expansionLongRadioOptions : expansionRadioOptions} />
  )
}
