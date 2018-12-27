// Component imports
import safeParseInt from './safeParseInt'





/**
 * Array.sort() function to sort stripe store products by the "sortPriority" metadata key
 */
const productPriorityDecendingSort = (aObj, bObj) => {
  const aPriority = aObj.attributes.metadata.sortPriority ? safeParseInt(aObj.attributes.metadata.sortPriority) : -1
  const bPriority = bObj.attributes.metadata.sortPriority ? safeParseInt(bObj.attributes.metadata.sortPriority) : -1

  return bPriority - aPriority
}





export default productPriorityDecendingSort
