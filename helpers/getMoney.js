

// ( ͡° ͜ʖ ͡°) because xlexious told me to
export default function getMoney (amount, currency) {
  (amount / 100).toLocaleString('en-GB', {
    style: 'currency',
    currency: currency || 'EUR',
    currencyDisplay: 'symbol',
  })
}
