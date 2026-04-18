export function resolveOptsOrSimple (optsOrSimple, simpleParamName) {
  if (typeof optsOrSimple === 'object' && optsOrSimple !== null) {
    return optsOrSimple
  }
  return { [simpleParamName]: optsOrSimple }
}
