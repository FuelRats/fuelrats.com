const isRequired = (pointer, override) => {
  throw new TypeError(override ? pointer : `${pointer} is a required argument.`)
}





export default isRequired
