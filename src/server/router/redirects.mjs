import { HttpStatus } from '@fuelrats/web-util/http'

// Component constants
const DAY_CHAR_LENGTH = 2
const MONTH_CHAR_LENGTH = 2
const YEAR_CHAR_LENGTH = 4

const redirects = [
  { from: '/blogs', to: '/blog' }, // Old blog used to exist at /blogs
  { from: '/fuel-rats-lexicon', to: 'https://confluence.fuelrats.com/pages/viewpage.action?pageId=3637257' }, // Lexicon used to be local
  { from: '/get-help', to: '/i-need-fuel' }, // get-help was used at launch of the website, but has since been changed back.
  { from: '/help', to: 'https://t.fuelr.at/help' }, // People often type this one manually into their URL bar to get to the helpdesk
  { from: '/privacy', to: '/privacy-policy' }, // Common endpoint for privacy policies
  { from: '/statistics', to: 'https://grafana.fuelrats.com' }, // statistics page is no longer on the website
  { from: '/profile', to: '/profile/overview' }, // Profile page requires a tab name in the path
]



const configureRedirects = (router) => {
  /***************************************************************************\
    Redirects
  \***************************************************************************/

  // Permanent Redirects
  redirects.forEach(({ from, to, type = HttpStatus.MOVED_PERMANENTLY, method = 'get' }) => {
    router[method](from, async (ctx) => {
      ctx.status = type
      await ctx.redirect(to)
    })
  })




  // Legacy Wordpress permalinks
  // e.g. /2017/09/07/universal-service-a-fuel-rats-thargoid-cartoon
  router.get('/:year/:month/:day/:slug', async (ctx, next) => {
    const {
      day,
      month,
      slug,
      year,
    } = ctx.params

    const dayIsValid = parseInt(day, 10) && (day.length === DAY_CHAR_LENGTH)
    const monthIsValid = parseInt(month, 10) && (month.length === MONTH_CHAR_LENGTH)
    const yearIsValid = parseInt(year, 10) && (year.length === YEAR_CHAR_LENGTH)

    if (dayIsValid && monthIsValid && yearIsValid) {
      ctx.status = 301
      await ctx.redirect(`/blog/${slug}`)
    }

    await next()
  })
}





export default configureRedirects
