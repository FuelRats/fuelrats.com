export default function getValidityErrors (target, displayName) {
  const {
    badInput,
    patternMismatch,
    rangeOverflow,
    rangeUnderflow,
    stepMismatch,
    tooLong,
    tooShort,
    typeMismatch,
    valid,
    valueMissing,
  } = target.validity

  if (valid) {
    return []
  }

  const errors = []

  if (badInput) {
    errors.push('Your input is invalid for the given field type. I don\'t know how you achieved this, but good job!')
  } else if (valueMissing) {
    errors.push(`${displayName} is a required field.`)
  } else {
    if (patternMismatch) {
      errors.push(target.getAttribute('data-pattern-message') || `${displayName} must follow the pattern ${String(target.getAttribute('pattern'))}`)
    }

    if (typeMismatch) {
      errors.push(`${displayName} must be a valid ${target.type}.`)
    }

    if (tooShort) {
      errors.push(`${displayName} must be at least ${target.getAttribute('minlength')} characters long.`)
    } else if (tooLong) {
      errors.push(`${displayName} must be no more than ${target.getAttribute('maxlength')} characters long.`)
    } else if (rangeUnderflow) {
      errors.push(`${displayName} must be at least ${target.getAttribute('min')}.`)
    } else if (rangeOverflow) {
      errors.push(`${displayName} must be no more than ${target.getAttribute('max')}.`)
    }

    if (stepMismatch) {
      errors.push(`${displayName} must be a value that is divisible by ${target.getAttribute('step')}`)
    }
  }


  return errors
}
