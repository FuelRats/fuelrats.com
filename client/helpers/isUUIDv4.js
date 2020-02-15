const isUUIDv4 = (str) => {
  return Boolean(str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu))
}





export default isUUIDv4
