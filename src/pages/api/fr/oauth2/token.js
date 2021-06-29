import getEnv from '~/util/server/getEnv'

import { frApiProxy } from '../[[...slug]]'


const env = getEnv()


export default frApiProxy({
  auth: `${env.frapi.clientId}:${env.frapi.clientSecret}`,
})
