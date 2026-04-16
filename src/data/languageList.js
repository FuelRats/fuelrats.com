const languageList = {
  bg: {
    short: 'BG',
    long: 'Bulgarian',
  },
  bs: {
    short: 'BS',
    long: 'Bosnian',
  },
  ca: {
    short: 'CA',
    long: 'Catalan / Valencian',
  },
  cs: {
    short: 'CS',
    long: 'Czech',
  },
  da: {
    short: 'DA',
    long: 'Danish',
  },
  de: {
    short: 'DE',
    long: 'German',
  },
  el: {
    short: 'EL',
    long: 'Modern Greek',
  },
  en: {
    short: 'EN',
    long: 'English',
  },
  es: {
    short: 'ES',
    long: 'Spanish / Castilian',
  },
  et: {
    short: 'ET',
    long: 'Estonian',
  },
  fi: {
    short: 'FI',
    long: 'Finnish',
  },
  fr: {
    short: 'FR',
    long: 'French',
  },
  he: {
    short: 'HE',
    long: 'Modern Hebrew',
  },
  hr: {
    short: 'HR',
    long: 'Croatian',
  },
  hu: {
    short: 'HU',
    long: 'Hungarian',
  },
  it: {
    short: 'IT',
    long: 'Italian',
  },
  ja: {
    short: 'JA',
    long: 'Japanese',
  },
  lt: {
    short: 'LT',
    long: 'Lithuanian',
  },
  lv: {
    short: 'LV',
    long: 'Latvian',
  },
  nb: {
    short: 'NB',
    long: 'Norwegian Bokmål',
  },
  nv: {
    short: 'NV',
    long: 'Navajo, Navaho',
  },
  nl: {
    short: 'NL',
    long: 'Dutch',
  },
  pl: {
    short: 'PL',
    long: 'Polish',
  },
  pt: {
    short: 'PT',
    long: 'Portuguese',
  },
  ro: {
    short: 'RO',
    long: 'Romanian, Moldavian, Moldovan',
  },
  ru: {
    short: 'RU',
    long: 'Russian',
  },
  sk: {
    short: 'SK',
    long: 'Slovak',
  },
  sl: {
    short: 'SL',
    long: 'Slovene',
  },
  sr: {
    short: 'SR',
    long: 'Serbian',
  },
  sv: {
    short: 'SV',
    long: 'Swedish',
  },
  th: {
    short: 'TH',
    long: 'Thai',
  },
  tr: {
    short: 'TR',
    long: 'Turkish',
  },
  uk: {
    short: 'UK',
    long: 'Ukrainian',
  },
  unknown: {
    short: '?',
    long: 'Unknown...',
  },
  zh: {
    short: 'ZH',
    long: 'Chinese',
  },
}


export default languageList

function getRegionName (regionCode) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(regionCode.toUpperCase())
  } catch {
    return regionCode
  }
}

function getRegionFlag (regionCode) {
  if (!/^[a-zA-Z]{2}$/u.test(regionCode)) {
    return null
  }

  const offset = 0x1F1E6 - 'A'.charCodeAt(0)
  const upper = regionCode.toUpperCase()

  return String.fromCodePoint(upper.charCodeAt(0) + offset, upper.charCodeAt(1) + offset)
}

export function getLanguage (lang) {
  if (!lang) {
    return languageList.unknown
  }

  const [langCode, regionCode] = lang.split('-')
  const langData = languageList[langCode] ?? {
    short: langCode.toUpperCase(),
    long: langCode,
  }

  if (!regionCode) {
    return { ...langData, region: null, flag: null }
  }

  return {
    ...langData,
    region: getRegionName(regionCode),
    flag: getRegionFlag(regionCode),
  }
}
