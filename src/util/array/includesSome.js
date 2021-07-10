export default function includesSome (target, items) {
  return target.some((targetItem) => {
    return items.includes(targetItem)
  })
}
