---
"fuelrats.com": patch
---

### Fixed
- Changing your e-mail address works again. The Change E-Mail dialog now asks for your current password, and for your authenticator code if you use two-factor authentication, which the API requires since it started re-checking who you are before an e-mail change. Wrong passwords, wrong or missing codes and too many attempts now show clear messages instead of "unauthorized".
