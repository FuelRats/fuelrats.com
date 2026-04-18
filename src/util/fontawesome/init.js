import { library, config } from '@fortawesome/fontawesome-svg-core'

import * as faIcons from './library'

config.autoAddCss = false
library.add(...Object.values(faIcons))
