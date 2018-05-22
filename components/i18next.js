// Module imports

import i18next from 'i18next'
//import i18nextCache from 'i18next-localstorage-cache'
import i18nextLanguageDetector from 'i18next-browser-languagedetector'
import i18nextFetchBackend from 'i18next-fetch-backend'





export default new Promise((resolve, reject) => {
  i18next
    //.use(i18nextCache)
    .use(i18nextLanguageDetector)
    .use(i18nextFetchBackend)
    .init({
      backend: {
        loadPath: 'https://raw.githubusercontent.com/FuelRats/translations/master/{{lng}}/{{ns}}.json',
      },
      debug: false,
      defaultNS: 'translation',
      lng: 'en-US',
      load: 'currentOnly',
      ns: [
        'translation',
      ],
    }, error => {
      if (error) {
        return reject(error)
      }

      return resolve(i18next)
    })
})
