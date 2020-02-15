// ( ͡° ͜ʖ ͡°) because xlexious told me to
const getMoney = (amount, currency = 'EUR') => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
}





export default getMoney
