export const expansionNameMap = {
  horizons3: 'H3.8',
  horizons4: 'H4.0',
  odyssey: 'ODY',
}

export const expansionLongNameMap = {
  horizons3: 'Horizons 3.8',
  horizons4: 'Horizons 4.0',
  odyssey: 'Odyssey',
}


export const expansionRadioOptions = Object.entries(expansionNameMap).map(([value, label]) => {
  return {
    value,
    label,
  }
})

export const expansionLongRadioOptions = Object.entries(expansionLongNameMap).map(([value, label]) => {
  return {
    value,
    label,
  }
})
