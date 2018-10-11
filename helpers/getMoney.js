// ( ͡° ͜ʖ ͡°) because xlexious told me to
export default function getMoney (amount, currency = 'EUR') {
  return (amount / 100).toLocaleString('en-GB', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
}
