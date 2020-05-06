import fingerprint from 'fingerprintjs2'
import UAParser from 'ua-parser-js'

import safeIdleCallback from './safeIdleCallback'

const FINGERPRINT_SEED = 31
const HASH_KEY = 'fr.ash'

const fingerprintOptions = {
  preprocessor: (key, value) => {
    switch (key) {
      case 'userAgent': {
        const agentParser = new UAParser(value)
        const agentOS = agentParser.getOS()
        const agentDevice = agentParser.getDevice()
        return `
          ${agentOS.name}
          ${agentOS.version}
          ${agentParser.getBrowser().name}
          ${agentDevice.model}
          ${agentDevice.type}
          ${agentDevice.vendor}
          ${agentParser.getCPU().architecture}
        `
      }

      default:
        return value
    }
  },
  excludes: {
    screenResolution: true,
    availableScreenResolution: true,
    webgl: true,
    adBlock: true,
    enumerateDevices: true,
  },
}



export default function getFingerprint () {
  return new Promise((resolve, reject) => {
    let fpHash = localStorage.getItem(HASH_KEY)

    if (fpHash) {
      resolve(fpHash)
      return
    }

    try {
      safeIdleCallback(() => {
        fingerprint.get(fingerprintOptions, (components) => {
          fpHash = fingerprint.x64hash128(
            components.reduce((acc, { value }) => {
              return acc + value.toString()
            }, ''),
            FINGERPRINT_SEED,
          )

          localStorage.setItem(HASH_KEY, fpHash)
          resolve(fpHash)
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}
