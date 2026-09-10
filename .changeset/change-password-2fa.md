---
"fuelrats.com": patch
---

### Fixed
- Users with two-factor authentication enabled can now change their password. The change-password dialog now prompts for an authenticator code when 2FA is enabled and sends it with the request, which the API requires to re-authenticate the change.
