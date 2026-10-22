---
"fuelrats.com": patch
---

### Fixed
- Requests to the API are attributed to the visitor's real IP address. Client-supplied `X-Forwarded-For` headers can no longer be used to dodge rate limits or donation bans.
