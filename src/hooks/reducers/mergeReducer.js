export default function mergeReducer (state, fragment) {
  const resolvedFragment = typeof fragment === 'function'
    ? fragment(state)
    : (fragment ?? {})

  return {
    ...(state ?? {}),
    ...resolvedFragment,
  }
}
