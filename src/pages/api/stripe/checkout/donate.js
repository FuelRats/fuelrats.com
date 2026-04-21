/* eslint-disable no-magic-numbers */

import Stripe from 'stripe'

import { BadRequestAPIError } from '~/util/server/errors'
import getEnv from '~/util/server/getEnv'
import acceptMethod from '~/util/server/middleware/acceptMethod'
import ipFilter from '~/util/server/middleware/ipFilter'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'
import requireFingerprint from '~/util/server/middleware/requireFingerprint'
import trafficController from '~/util/server/middleware/trafficController'



const env = getEnv()
const stripe = new Stripe(env.stripe.secret)

const SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp']
const MIN_AMOUNT = 100

const getDonationItemInfo = (amount) => {
  if (amount >= 3500) {
    return {
      description: 'Mother of rats! Talk about a boatload of generosity! We highly appreciate you going the extra lightyear to help us out. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins35.png',
    }
  }

  if (amount >= 2000) {
    return {
      description: 'Holy limpet! You sure like to live dangerously! We are most grateful for everything you can give. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins20.png',
    }
  }

  if (amount >= 1000) {
    return {
      description: 'Wow! This is a major donation for our sake. A contribution like this offsets our running costs for three whole days! Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins10.png',
    }
  }


  if (amount >= 500) {
    return {
      description: 'Thank you so much! A donation like this will go a long way towards covering our running costs. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins5.png',
    }
  }

  return {
    description: 'Every little bit helps! Your contribution will ensure our continuous service to the galaxy. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins1.png',
  }
}




export default jsonApiRoute(
  ipFilter(),
  requireFingerprint(),
  trafficController(),
  acceptMethod.POST(),
  async (ctx) => {
    const {
      body = {},
    } = ctx.req

    const {
      amount,
      currency,
      email,
      customer,
      recurring,
    } = body

    if (!Number.isInteger(amount) || amount < MIN_AMOUNT) {
      throw new BadRequestAPIError({ pointer: '/data/attributes/amount' })
    }

    if (!currency || !SUPPORTED_CURRENCIES.includes(currency.toLowerCase())) {
      throw new BadRequestAPIError({ pointer: '/data/attributes/currency' })
    }

    const isRecurring = Boolean(recurring)
    const donationInfo = getDonationItemInfo(amount)

    const priceData = {
      currency,
      unit_amount: amount,
      product_data: {
        name: isRecurring ? 'Monthly Donation' : 'One-time Donation',
        description: donationInfo?.description,
        images: [
          donationInfo?.image,
        ],
      },
    }

    if (isRecurring) {
      priceData.recurring = { interval: 'month' }
    }

    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? 'subscription' : 'payment',
      ui_mode: 'embedded',
      return_url: `${env.appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      submit_type: isRecurring ? undefined : 'donate',
      allow_promotion_codes: false,
      customer_email: customer ? undefined : email,
      customer: customer || undefined,
      line_items: [{
        price_data: priceData,
        quantity: 1,
      }],
      metadata: {
        fr_payment_type: isRecurring ? 'donate_recurring' : 'donate',
      },
    })

    ctx.send({
      id: session.id,
      type: 'stripe-checkout-session',
      attributes: {
        clientSecret: session.client_secret,
      },
    })
  },
)
