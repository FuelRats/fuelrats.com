export default function includesAll (target, items) {
  return target.every((targetItem) => {
    return items.includes(targetItem)
  })
}
