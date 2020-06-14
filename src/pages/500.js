import { HttpStatus } from '@fuelrats/web-util/http'
import { makeStaticErrorPage } from './404'





export default makeStaticErrorPage(HttpStatus.INTERNAL_SERVER_ERROR)
