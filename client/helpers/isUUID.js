const isUUIDv1 = (str) => Boolean(str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu))
const isUUIDv2 = (str) => Boolean(str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-2[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu))
const isUUIDv3 = (str) => Boolean(str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu))
const isUUIDv4 = (str) => Boolean(str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu))
const isUUIDv5 = (str) => Boolean(str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu))





export {
  isUUIDv1,
  isUUIDv2,
  isUUIDv3,
  isUUIDv4,
  isUUIDv5,
}
