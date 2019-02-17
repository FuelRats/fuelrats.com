import React from 'react'




const HiddenFormData = ({ data }) => (
  <fieldset>
    {Object.entries(data).map(([key, value]) => (
      <input
        aria-hidden
        id={key}
        key={key}
        name={key}
        type="hidden"
        value={value} />
    ))}
  </fieldset>
)





export default HiddenFormData
