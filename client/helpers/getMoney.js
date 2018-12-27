// ( ͡° ͜ʖ ͡°) because xlexious told me to
const getMoney = (amount, currency = 'EUR') => (amount / 100).toLocaleString('en-GB', {
  style: 'currency',
  currency,
  currencyDisplay: 'symbol',
})





export default getMoney
