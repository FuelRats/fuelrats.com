export default function isRequired (pointer, override) {
  throw new TypeError(override ? pointer : `${pointer} is a required argument.`)
}
