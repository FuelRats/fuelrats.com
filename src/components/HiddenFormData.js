function HiddenFormData ({ data }) {
  return (
    <fieldset>
      {
        Object.entries(data).map(([key, value]) => {
          return (
            <input
              key={key}
              aria-hidden
              id={key}
              name={key}
              type="hidden"
              value={value} />
          )
        })
      }
    </fieldset>
  )
}





export default HiddenFormData
