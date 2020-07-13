import React from 'react'

import platformRadioOptions from '~/data/platformRadioOptions'

import RadioFieldset from './RadioFieldset'





export default function PlatformFieldset (props) {
  return (
    <RadioFieldset
      {...props}
      options={platformRadioOptions} />
  )
}
