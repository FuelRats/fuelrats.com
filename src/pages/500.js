import { makeStaticErrorPage } from './404'
import { HttpStatus } from '~/helpers/HttpStatus'





export default makeStaticErrorPage(HttpStatus.INTERNAL_SERVER_ERROR)
