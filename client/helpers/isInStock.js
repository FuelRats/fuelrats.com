const isInStock = ({ quantity, type, value }) => {
  switch (type) {
    case 'finite':
      return quantity

    case 'bucket':
      switch (value) {
        case 'in_stock':
        case 'limited':
          return true
        default:
          return false
      }

    case 'infinite':
      return true

    default:
      return false
  }
}





export default isInStock
