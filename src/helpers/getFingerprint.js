import fingerprint from 'fingerprintjs2'
import UAParser from 'ua-parser-js'

import safeIdleCallback from './safeIdleCallback'

const FINGERPRINT_SEED = 31

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
    try {
      safeIdleCallback(() => {
        fingerprint.get(fingerprintOptions, (components) => {
          resolve(
            fingerprint.x64hash128(
              components.reduce((acc, { value }) => {
                return acc + value.toString()
              }, ''),
              FINGERPRINT_SEED,
            ),
          )
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}
