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
const PROFILE_TIMEOUT_MS = 10000

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




// Looks up the signed-in user's Stripe customer from their own profile, so a client can't attach a donation to
// someone else's customer record.
async function getStripeCustomer (ctx) {
  const accessToken = ctx.req.cookies?.access_token
  if (!accessToken) {
    return undefined
  }

  try {
    const { data } = await ctx.fetch({
      url: `${env.frapi.url}/profile`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Forwarded-For': ctx.req.ip,
        'X-Real-IP': ctx.req.ip,
      },
      timeout: PROFILE_TIMEOUT_MS,
    })
    return data?.data?.attributes?.stripeId ?? undefined
  } catch (error) {
    // An expired or invalid session still lets the visitor donate as a guest.
    console.warn('[donate] Could not resolve the Stripe customer; continuing as a guest.', error.id ?? error)
    return undefined
  }
}




export default jsonApiRoute(
  acceptMethod.POST(),
  ipFilter(),
  requireFingerprint(),
  trafficController(),
  async (ctx) => {
    const {
      body = {},
    } = ctx.req

    const {
      amount,
      currency,
      email,
      recurring,
    } = body

    if (!Number.isInteger(amount) || amount < MIN_AMOUNT) {
      throw new BadRequestAPIError({ pointer: '/data/attributes/amount' })
    }

    if (typeof currency !== 'string' || !SUPPORTED_CURRENCIES.includes(currency.toLowerCase())) {
      throw new BadRequestAPIError({ pointer: '/data/attributes/currency' })
    }

    const isRecurring = recurring === true
    const customer = await getStripeCustomer(ctx)
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
      customer,
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
