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

export function getLanguage (lang) {
  if (!lang) {
    return languageList.unknown
  }

  const [langCode] = lang.split('-')
  const langData = languageList[langCode]

  if (!langData) {
    return {
      short: langCode,
      long: langCode,
    }
  }

  return langData
}
