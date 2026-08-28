---
"fuelrats.com": patch
---

### Fixed
- Rescue, rat, and profile views no longer crash on missing or incomplete data (rats without a platform, users with no rats, or a rescue that has left the board)
- Paperwork: changing a rescue's platform no longer clears the assigned rats and first limpet
- Paperwork: the edit form no longer gets stuck in a disabled "Submitting…" state when submitted without an outcome
- Case-normalizing redirects (for example an uppercase rescue ID) no longer crash during in-app navigation
- The epic nomination rescue details no longer show the CMDR row twice
- The front-page carousel resumes auto-advancing after you pick a slide manually
- Pagination no longer shows a stale page number after navigating
- The version page no longer links to broken URLs when build metadata is unavailable
- The donation result page now shows an appropriate message when a donation is cancelled
- Push notification filter toggles no longer risk subscribing twice
- Dispatch board settings load reliably instead of briefly flashing default values

### Added
- "Try again" buttons on the leaderboard and blog when a load fails
- Per-view page titles for blog author, category, and article pages

### Changed
- Accessibility: form validation and error messages are announced to screen readers, copy-to-clipboard controls are keyboard-operable and announce when copied, and action menus expose proper menu semantics
- Improved spacing on smaller screens for forms and page content

### Security
- Server-side rendering no longer risks leaking one visitor's IP address onto another visitor's API request
- The Stripe donation IP ban list is now correctly enforced
