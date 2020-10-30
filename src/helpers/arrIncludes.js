export function includesAll (target, items) {
  return target.every((targetItem) => {
    return items.includes(targetItem)
  })
}

export function includesSome (target, items) {
  return target.some((targetItem) => {
    return items.includes(targetItem)
  })
}
