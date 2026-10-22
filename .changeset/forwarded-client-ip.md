---
"fuelrats.com": patch
---

### Fixed
- Requests to the API are attributed to the visitor's real IP address. Client-supplied `X-Forwarded-For` headers can no longer be used to dodge rate limits or donation bans.
- Your Fuel Rats session is no longer sent to WordPress or the systems API when loading blog content or star system data.
- Donations made while signed in are always linked to your own Stripe customer record.
- Server errors no longer expose internal details; they include an error ID you can quote when reporting a problem.
