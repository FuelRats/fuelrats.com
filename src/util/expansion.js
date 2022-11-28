export const expansionNameMap = {
  horizons3: 'LEG',
  horizons4: 'HOR',
  odyssey: 'ODY',
}

export const expansionLongNameMap = {
  horizons3: 'Legacy',
  horizons4: 'Horizons',
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
