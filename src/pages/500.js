import { HttpStatus } from '../helpers/HttpStatus'
import { makeStaticErrorPage } from './404'





export default makeStaticErrorPage(HttpStatus.INTERNAL_SERVER_ERROR)
