import axios from 'axios'
import { AnimatePresence, m } from 'framer-motion'
import getConfig from 'next/config'
import { useCallback, useEffect, useRef, useState } from 'react'

import JsonEditor from '~/components/JsonEditor'
import styles from '~/scss/pages/locale-editor.module.scss'

const { publicRuntimeConfig } = getConfig()
const { appUrl } = publicRuntimeConfig

/* eslint-disable id-length */
const formMotionConfig = {
  initial: { y: '-400px', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '400px', opacity: 0 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    restDelta: 0.5,
    restSpeed: 10,
  },
}
/* eslint-enable id-length */


function LocaleEditor ({ locales }) {
  const [localeLoading, setLocaleLoading] = useState(false)
  const [localeData, setLocaleData] = useState({})
  const localeDataRef = useRef(localeData)
  localeDataRef.current = localeData
  const [activeLocale, setActiveLocale] = useState(locales[0].id)

  const onSelectChange = useCallback((event) => {
    setActiveLocale(event.target.value)
  }, [])

  useEffect(() => {
    async function getLocaleData () {
      if (activeLocale && !localeDataRef.current[activeLocale]) {
        setLocaleLoading(true)
        const { data } = await axios.get(`/api/qms/locales/${activeLocale}`)

        setLocaleData((curData) => {
          return {
            ...curData,
            [activeLocale]: data.data.attributes.data,
          }
        })
        setLocaleLoading(false)
      }
    }
    getLocaleData()
  }, [activeLocale])

  return (
    <div className="page-content">
      <p className={styles.explainer}>
        {
        `This page is a basic editing helper for the QMS locale files. They are automatically generated from english Locale files found on the main branch.
         You may use basic HTML and some accept parameters `
        }
        <code>{'{{in_brackets_like_this}}'}</code>
        {'. Be sure to double check the default values for HTML content and parameterized strings! Is this overkill? absolutely. Did we do it anyway? Of course!'}
      </p>
      <div>
        <label htmlFor="presetSelector"><strong>{'Locale Files'}</strong></label>
        <select disabled={localeLoading} id="presetSelector" value={activeLocale} onChange={onSelectChange}>
          {
            locales?.map((locale) => {
              return (
                <option key={locale.id} value={locale.id}>{locale.id}</option>
              )
            })
          }
        </select>
      </div>
      <h6>
        <a href={`https://github.com/FuelRats/QMS/blob/main/qms/frontend/public/locales/en/${activeLocale}`}>{'GitHub'}</a>
        {' | '}
        <a href={`https://raw.githubusercontent.com/FuelRats/QMS/main/qms/frontend/public/locales/en/${activeLocale}`}>{'Raw'}</a>
        {' | '}
        <a href={`https://api.github.com/repos/FuelRats/QMS/contents/qms/frontend/public/locales/en/${activeLocale}?ref=main`}>{'Metadata'}</a>
      </h6>
      <br />
      <div className="presence-container">
        <AnimatePresence>
          {
            Boolean(localeData[activeLocale]) && (
              <m.div
                key={activeLocale}
                {...formMotionConfig}
                className="presence-animator">
                <JsonEditor data={localeData[activeLocale]} />
              </m.div>
            )
          }
        </AnimatePresence>
      </div>
    </div>
  )
}

LocaleEditor.getInitialProps = async () => {
  const { data } = await axios.get(`${appUrl}/api/qms/locales`)

  return {
    locales: data.data,
  }
}

LocaleEditor.getPageMeta = () => {
  return {
    title: 'Locale Editor',
  }
}




export default LocaleEditor
