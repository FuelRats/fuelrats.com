// Component constants

/* eslint-disable no-magic-numbers */
const validYearRange = [2015, 2017]
const validMonthRange = [1, 12]
const validDayRange = [1, 31]
/* eslint-enable no-magic-numbers */

const isValidInRange = (numStr, min, max) => {
  const parsedNum = parseInt(numStr, 10)

  return !Number.isNaN(parsedNum) && parsedNum >= min && parsedNum <= max
}

const wpRedirect = (router) => {
  // Legacy Wordpress permalinks
  // e.g. /2017/09/07/universal-service-a-fuel-rats-thargoid-cartoon
  router.get('/:year/:month/:day/:slug', async (ctx, next) => {
    const {
      day,
      month,
      slug,
      year,
    } = ctx.params

    const yearIsValid = isValidInRange(year, ...validYearRange)
    const monthIsValid = isValidInRange(month, ...validMonthRange)
    const dayIsValid = isValidInRange(day, ...validDayRange)

    if (dayIsValid && monthIsValid && yearIsValid) {
      ctx.status = 301
      ctx.redirect(`/blog/${slug}`)
      return
    }

    await next()
  })
}





export default wpRedirect
