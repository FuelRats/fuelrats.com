import React from 'react'




function HiddenFormData ({ data }) {
  return (
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
}





export default HiddenFormData
