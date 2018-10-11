// Component imports
import safeParseInt from './safeParseInt'





/**
 * Array.sort() function to sort stripe store products by the "sortPriority" metadata key
 */
export default function productPriorityDecendingSort (a, b) {
  const aPriority = a.attributes.metadata.sortPriority ? safeParseInt(a.attributes.metadata.sortPriority) : -1
  const bPriority = b.attributes.metadata.sortPriority ? safeParseInt(b.attributes.metadata.sortPriority) : -1

  return bPriority - aPriority
}
