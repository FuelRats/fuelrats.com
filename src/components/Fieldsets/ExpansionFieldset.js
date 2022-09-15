import { expansionLongRadioOptions, expansionRadioOptions } from '~/util/expansion'

import RadioFieldset from './RadioFieldset'


export default function ExpansionFieldset ({ longNames = false, ...props }) {
  return (
    <RadioFieldset
      {...props}
      options={longNames ? expansionLongRadioOptions : expansionRadioOptions} />
  )
}
