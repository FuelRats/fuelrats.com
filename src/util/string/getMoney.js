/**
 * Converts numerical currency into a formatted currency string.
 *
 * ( ͡° ͜ʖ ͡°) Xlexious made me do it.
 *
 * @param {number} amount Amount of money expressed in minor currency. I.E. `$1.00` = `100`
 * @param {*} currency ISO 4217 3-letter currency code
 * @returns {string}
 */
export default function getMoney (amount, currency = 'EUR') {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
}
