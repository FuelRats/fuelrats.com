# fuelrats.com Changelog

## [2.17.0][] - 2025-4-30

### ✨ Added

* An option for users to update their registered email address through the user profile [#407][]
* Support for iOS deeplinking
* About Us and Surly's Vision pages [#408][]
* Line numbers on Dispatch Board case quotes [#419][]
* Systems API proxy to allow pulling system info in the Dispatch Board [#430][]
* System info to cases on Dispatch Board [#431][]
* Permit info to cases on Dispatch Board

### ⚡ Changed

* Redesigned platform indicators on Dispatch Board [#418][]
* Removed option to disable profiles [#421][]
* Renamed stApi to stripeApi to avoid confusion with new systems API
* Webstore link now points to a placeholder page instead of creating a redirect loop [#433][]

### 🐛 Fixed

* Invalid blog routes will now show a 404 page instead of a 200 error [#402][]
* Clicking on CMDR column on Dispatch Board now copies commander name instead of IRC nick [#428][]
* Meta descriptions for Blog, Donations, Dispatch Board, Leaderboard and Registration pages are no longer long enough to break unit tests (and SEO)

### ⚙ Tasks

* ESLint settings brought up to date
* Minor SCSS cleanup to keep the linter happy [#434][]

[#402]: https://github.com/FuelRats/fuelrats.com/pull/402
[#407]: https://github.com/FuelRats/fuelrats.com/pull/407
[#408]: https://github.com/FuelRats/fuelrats.com/pull/408
[#418]: https://github.com/FuelRats/fuelrats.com/pull/418
[#419]: https://github.com/FuelRats/fuelrats.com/pull/419
[#421]: https://github.com/FuelRats/fuelrats.com/pull/421
[#428]: https://github.com/FuelRats/fuelrats.com/pull/428
[#430]: https://github.com/FuelRats/fuelrats.com/pull/430
[#431]: https://github.com/FuelRats/fuelrats.com/pull/431
[#433]: https://github.com/FuelRats/fuelrats.com/pull/433
[#434]: https://github.com/FuelRats/fuelrats.com/pull/434
[2.17.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.16.0...v2.17.0

## [2.16.0][] - 2022-11-29

### ⚡ Changed

* Replaced Twitter with Mastadon [#391][]
* Update merch store link [#389][]

[#389]: https://github.com/FuelRats/fuelrats.com/pull/389
[#391]: https://github.com/FuelRats/fuelrats.com/pull/391
[2.16.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.15.0...v2.16.0

## [2.15.0][] - 2022-09-15

### ✨ Added

* Registration now has a "confirm email" field to prevent email typos. [#387][]

### ⚡ Changed

* Replaced Odyssey bool with expansion field across the app. [#387][]
* Minor updates to site color scheme

[#387]: https://github.com/FuelRats/fuelrats.com/pull/387
[2.15.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.14.2...v2.15.0

## [2.14.2][] - 2021-12-18

### ⚡ Changed

* Improved error messaging for IRC Nick inputs.

### 🐛 Fixed

* Fixed an issue preventing tagged nicks from being registered.

[2.14.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.14.1...v2.14.2

## [2.14.1][] - 2021-11-07

### 🐛 Fixed

* Removed redundant error handlers to allow errors to be properly conveyed.

### ⚙ Tasks

* Upgraded dependencies to fix security header issues and migrate to Next 12

[2.14.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.14.0...v2.14.1

## [2.14.0][] - 2021-10-17

### ✨ Added

* A new page to assist with editing QMS locale files has been added. - [#370][]
* A general purpose JSON object editor has been implemented. this should come in handy at some point! - [#370][]
* User avatars are now customizable through our new Avatar uploader! - [#332][], [#375][]

### ⚡ Changed

* Error readout for unknown API Errors has been improved. - [#328][]
* Reworded `Owns Odyssey` to `Using Odyssey` on rat cards to better convey the toggle's meaning. - [#328][]
* Canceled donations will now return you to the donation form. - [#328][]
* Optimized image loading and accessibility for images site-wide. - [#328][]
* Further optimized font loading. - [#328][]
* Moved raw version information to an API route (`/api/version`), and reworked version page to draw information from that route. - [#328][]
* Moved all custom server functions into suitable replacements provided by our site framework. - [#329][]
  * This move has let us drop our entire custom backend.
* Updated `<Switch />` with an improved loading state animation. - [#330][]
* Open rescues may no longer be edited by normal users while the rescue is open - [#373]
* Other smaller changes to sreamline development. - [#328][], [#329][], [#370][]

### 🐛 Fixed

* Failure to load password evaluation will no longer prevent forms that use it from being submitted. - [#328][]
* Authorization page no longer displays an `Invalid Authorize Request` error when redirecting users after login. - [#328][]
* `Using Odyssey` switch now properly enters a loading state while waiting on it's event handler to resolve. - [#330][]
* Profile page will no longer crash when deleting a rat. - [#333][]

### ⚙ Tasks

* Update lint configs
* Add `@next/eslint-plugin-next` into linting config.

[#328]: https://github.com/FuelRats/fuelrats.com/pull/328
[#329]: https://github.com/FuelRats/fuelrats.com/pull/329
[#330]: https://github.com/FuelRats/fuelrats.com/pull/330
[#332]: https://github.com/FuelRats/fuelrats.com/pull/332
[#333]: https://github.com/FuelRats/fuelrats.com/pull/333
[#370]: https://github.com/FuelRats/fuelrats.com/pull/370
[#373]: https://github.com/FuelRats/fuelrats.com/pull/373
[#375]: https://github.com/FuelRats/fuelrats.com/pull/375
[2.14.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.13.1...v2.14.0

## [2.13.1][] - 2021-03-19

### ✨ Added

* An icon will now appear on rescues being held on the Elite Dangerous: Odyssey server. - [#326][]

### ⚡ Changed

* Improved queue information display on Disaptch Board. - [#326][]
* Improved queue information endpoint response times via better routing and caching. - [#326][]

[#326]: https://github.com/FuelRats/fuelrats.com/pull/326
[2.13.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.13.0...v2.13.1

## [2.13.0][] - 2021-03-19

### ✨ Added

* Added controls for rats to opt-in to Odyssey rescues. - [#320][]
* Added `odyssey` field to registration page. - [#320][]
* Added basic QMS queue counter to Dispatch Board. - [#323][]

### ⚡ Changed

* Reworked page for nominating epic rats/rescues. - [#316][]

### 🐛 Fixed

* Resolved crash which would occur if rescue quotes is null. - [#324][]

### ⚙ Tasks

* Add @Delota as a contributor! 🥳 - [#317][]

[#316]: https://github.com/FuelRats/fuelrats.com/pull/316
[#317]: https://github.com/FuelRats/fuelrats.com/pull/317
[#320]: https://github.com/FuelRats/fuelrats.com/pull/320
[#323]: https://github.com/FuelRats/fuelrats.com/pull/323
[#324]: https://github.com/FuelRats/fuelrats.com/pull/324
[2.13.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.10...v2.13.0

## [2.12.10][] - 2021-03-10

### ⚡ Changed

* Removed the asterisk that displays when an input is required. - [#315]
  * This will be re-introduced with some better visuals at a later date.

### 🐛 Fixed

* Resolved issue preventing api routes from being correctly proxied. - [#314][]
  * Also take steps to ensure that doesn't happen again.
* Resolved issue prevening donation sessions from being created. - [#315][]
* Resolved a crash on the paperwork page which would occur when changing the platform in certain situations. - [#315][]

[#314]: https://github.com/FuelRats/fuelrats.com/pull/314
[#315]: https://github.com/FuelRats/fuelrats.com/pull/315
[2.12.10]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.9...v2.12.10

## [2.12.9][] - 2021-03-10

### ✨ Added

* Added asterisk icon to inputs when they are required, but empty. - [#312][]

### ⚡ Changed

* Tightened security on donation session creation (again) - [#312][]
* Move fuelrats API routes to `/api/fr` to free up the api directory for other things. - [#312][]

[#312]: https://github.com/FuelRats/fuelrats.com/pull/312
[2.12.9]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.8...v2.12.9

## [2.12.8][] - 2021-02-01

### 🐛 Fixed

* Fix multiple issues with redeeming decals - [#309][]

[#309]: https://github.com/FuelRats/fuelrats.com/pull/309
[2.12.8]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.7...v2.12.8

## [2.12.7][] - 2021-01-28

### ✨ Added

* Create developer panel on profile so devs can control their clients. - [#302][]
  * This is a very early working version. The asethetics can come later 😅.

### ⚡ Changed

* Further improve message displayed when email validation token is invalid.
* Rescue details pane will now close if the focused rescue is closed. - [#307][]
* Logging out also removes your access token through the API, so your token cannot be used anywhere anymore. Thanks @Master-Guy! - [#305][]
* Improve application stability by using a real non-value in key places. - [#306][]

### 🐛 Fixed

* Decal panel will now properly allow multiple decal redemptions. - [#306][]
* Fixed dispatch page crash that could occur due to abnormal rescue object states. - [#306][]

### ⚙ Tasks

* Perform some preparation steps for Webpack 5 and Yarn PnP.
* Upgrade to Yarn 2 (but not PnP, that comes later when the bugs are solved).
* Add @Master-Guy as a contributor! 🥳 - [#304][]

[#302]: https://github.com/FuelRats/fuelrats.com/pull/302
[#304]: https://github.com/FuelRats/fuelrats.com/pull/304
[#305]: https://github.com/FuelRats/fuelrats.com/pull/305
[#306]: https://github.com/FuelRats/fuelrats.com/pull/306
[#307]: https://github.com/FuelRats/fuelrats.com/pull/307
[2.12.7]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.6...v2.12.7

## [2.12.6][] - 2020-12-20

### ✨ Added

* Added a message to the verification page which appears when a user attempts to verify a e-mail twice. - [#297][]

### 🐛 Fixed

* Change cases sorting to "last created first" on initial dispatch board load. Thanks @diraven! - [#298][]

### ⚙ Tasks

* Add @diraven as a contributor! 🎊 - [#299][]

[#297]: https://github.com/FuelRats/fuelrats.com/pull/297
[#298]: https://github.com/FuelRats/fuelrats.com/pull/298
[#299]: https://github.com/FuelRats/fuelrats.com/pull/299]
[2.12.6]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.5...v2.12.6

## [2.12.5][] - 2020-11-21

### ⚡ Changed

* Rewrite `ChangePasswordModal` and `DisableProfileModal` to use new form handling methods. - [#295][]

### 🐛 Fixed

* Resolve code bundling issue which caused the base bundle size to be more than double the size it should be. - [#295][]
* Fix race condition that would allow certain requests to be made as someone other than the user making the request. - [#295][]

[#295]: https://github.com/FuelRats/fuelrats.com/pull/295
[2.12.5]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.4...v2.12.5

## [2.12.4][] - 2020-10-30

### ✨ Added

* Hide main menu when a nav item is clicked. - [#293][]

### ⚡ Changed

* Remove next-named-routes since it's somewhat redundant now. - [#293][]
* rewrite `<UserMenu />` so it reuses the `<Nav />` components made for `<Header />`. - [#293][]

### 🐛 Fixed

* Resolve error that would cause password resets to intermittently fail. - [#290][]
* Resolve issues with DST improperly applying to date/time displays. - [#291][]
* fixed a typo that stopped rats from being deleted. - [#292][]

### ⚙ Tasks

* Upgrade to Next.JS 10. - [#293][]
* Upgrade to React 17. - [#293][]

[#290]: https://github.com/FuelRats/fuelrats.com/pull/290
[#291]: https://github.com/FuelRats/fuelrats.com/pull/291
[#292]: https://github.com/FuelRats/fuelrats.com/pull/292
[#293]: https://github.com/FuelRats/fuelrats.com/pull/293
[2.12.4]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.3...v2.12.4

## [2.12.3][] - 2020-10-19

### ✨ Added

* Add `apple-app-site-association` page for verification with apple services.
* Add internal avatar generator to remove dependency on an external API. - [#286][]
* Add message to `/dispatch`'s `401` page so users know why they can't access the board. - [#288][]

### ⚡ Changed

* re-enable filtering for leaderboard names.
* specify avatar size when loading default avatar to optimize network usage. - [#286][]
* Replace `react-spring` with `framer-motion` for js animations. - [#287][]
* Rewrite parts of `<Nav />` and `<Header />` code so it's easier to work with. - [#288][]

### ⚙ Tasks

* Remove unused React imports and clean up import formatting. - [#287][]

[#286]: https://github.com/FuelRats/fuelrats.com/pull/286
[#287]: https://github.com/FuelRats/fuelrats.com/pull/287
[#288]: https://github.com/FuelRats/fuelrats.com/pull/288
[2.12.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.2...v2.12.3

## [2.12.2][] - 2020-10-02

This is the second recovery patch from APIv3 release. Changes were committed directly to develop for speed.

### ✨ Added

* Banner on profile page will appear when the user is not verified.

### ⚡ Changed

* Error ID will now be provided when users encounter a problem with the verifications page.
* Redundant CMDR check on CMDR name input is now case insensitive.
* Validation status icon on form inputs are no longer interactable.
  * This is to provide some form of support for lastpass popup icon.
* Improve password input and validation for login and registration.
* Improve auto focus function of login form.

### 🐛 Fixed

* Profile page crash if the user was unverified, but had a decal (somehow).

[2.12.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.1...v2.12.2

## [2.12.1][] - 2020-09-29

This is the first recovery patch from APIv3 release. Changes were committed directly to develop for speed.

### ⚡ Changed

* Paperwork page now detects and corrects uppercase rescue ids.
* Dispatch board updating flash animation flashes in grey instead of red.
* Code Red and Inactive cases on the dispatch board use background colors from the original board.
* Case quotes on the dispatch board have a new styling and parsing system.

### 🐛 Fixed

* Problems with permission checking have been corrected.
* Dispatch board displays timestamps in UTC instead of local time as intended.
* Dispatch board correctly displays loading circle while it's loading.
* Paperwork page properly enters submitting state when submitted.

[2.12.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.12.0...v2.12.1

## [2.12.0][] - 2020-09-26

### ✨ Added

* Support for APIv3. - [#191][], [#238][], [#240][], [#241][], [#245][], [#248][], [#251][], [#254][], [#255][], [#260][], [#263][], [#264][], [#266][], [#267][], [#268][], [#270][]
* Add support for 2FA login flow. - [#240][], [#241][]
* Disable profile function which soft deletes a user. - [#220][], [#265][]
* Add new system for generating forms which is more robust than any of our previous solutions. - [#254][], [#263][]
* Integrate dispatch board. - [#271][]

### ⚡ Changed

* Reworked error page so it integrates better into the website. - [#240][]
* Redesign oauth authorize page for better context into what access apps request. - [#247][], [#269][]
* Updated styles for checkboxes. - [#253][]
* Rewrite `<LoginForm />` and `<Switch />`. - [#263][]

### 🐛 Fixed

* Fixed removal of the accessToken cookie when the token is revoked. - [#240][]
* Fixed error that occurred when user is not authorized to view a page. - [#240][]
* Fixed bold font tag (`<b/>`) not doing anything to text. - [#241][]

### ⚙ Tasks

* Add `babel-plugin-classnames` into our babel toolchain. see [documentation](docs/css_classes_in_jsx.md). - [#243][]
* Add tool for generating TOCs in md files. - [#243][]
* Add new blueprints (which are even cooler than snippets) for defining components in our website. - [#246][], [#254][]
* Use github actions for our CI/CD solution. - [#256][], [#258][]
* Drop basic support for IE 11. We will now redirect IE 11 users to our fallback website which will get them help. - [#262][]
* Upgrade to Next 9.5. - [#263][]
* use `.env.local` over `.env`. - [#263][]

[2.12.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.11.5...v2.12.0
[#191]: https://github.com/FuelRats/fuelrats.com/pull/191
[#220]: https://github.com/FuelRats/fuelrats.com/pull/220
[#238]: https://github.com/FuelRats/fuelrats.com/pull/238
[#240]: https://github.com/FuelRats/fuelrats.com/pull/240
[#241]: https://github.com/FuelRats/fuelrats.com/pull/241
[#243]: https://github.com/FuelRats/fuelrats.com/pull/243
[#245]: https://github.com/FuelRats/fuelrats.com/pull/245
[#247]: https://github.com/FuelRats/fuelrats.com/pull/247
[#248]: https://github.com/FuelRats/fuelrats.com/pull/248
[#251]: https://github.com/FuelRats/fuelrats.com/pull/251
[#253]: https://github.com/FuelRats/fuelrats.com/pull/253
[#254]: https://github.com/FuelRats/fuelrats.com/pull/254
[#255]: https://github.com/FuelRats/fuelrats.com/pull/255
[#256]: https://github.com/FuelRats/fuelrats.com/pull/256
[#258]: https://github.com/FuelRats/fuelrats.com/pull/258
[#260]: https://github.com/FuelRats/fuelrats.com/pull/260
[#262]: https://github.com/FuelRats/fuelrats.com/pull/262
[#263]: https://github.com/FuelRats/fuelrats.com/pull/263
[#264]: https://github.com/FuelRats/fuelrats.com/pull/264
[#265]: https://github.com/FuelRats/fuelrats.com/pull/265
[#266]: https://github.com/FuelRats/fuelrats.com/pull/266
[#267]: https://github.com/FuelRats/fuelrats.com/pull/267
[#268]: https://github.com/FuelRats/fuelrats.com/pull/268
[#269]: https://github.com/FuelRats/fuelrats.com/pull/269
[#270]: https://github.com/FuelRats/fuelrats.com/pull/270
[#271]: https://github.com/FuelRats/fuelrats.com/pull/271

## [2.11.5][] - 2020-05-09

### 🐛 Fixed

* Resolved issues with our CSS processing config. - [#242][]

[2.11.5]: https://github.com/FuelRats/fuelrats.com/compare/v2.11.4...v2.11.5
[#242]: https://github.com/FuelRats/fuelrats.com/pull/242

## [2.11.4][] - 2020-05-24

### ✨ Added

* Add `.trim()` in to various inputs to prevent issues with spaces in names. - [#249][]

### ⚡ Changed

* Reword all instances of "get help" to "get fuel". - [#249][]
* Change out old carousel for a new set of images. - [#249][]
* Make TOS/PP notice more obvious on /i-need-fuel. - [#249][]

### ⚙ Tasks

* Switch to new SVG implementation. - [#249][]

[2.11.4]: https://github.com/FuelRats/fuelrats.com/compare/v2.11.3...v2.11.4
[#249]: https://github.com/FuelRats/fuelrats.com/pull/249

## [2.11.3][] - 2020-05-09

### 🐛 Fixed

* Resolved issues with our CSS processing config. - [#242][]

[2.11.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.11.2...v2.11.3

## [2.11.2][] - 2020-04-16

### 🐛 Fixed

* Fixed a 404 error that occurred after signing in when attempting to access an authenticated page. - [#236][]

[2.11.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.11.1...v2.11.2
[#236]: https://github.com/FuelRats/fuelrats.com/pull/236

## [2.11.1][] - 2020-04-13

### 🐛 Fixed

* Resolved client error that occurs when attempting to authorize an external application - [#233][]
* Resolved server error that arises when donation api bans file is not configured - [#233][]
* Fixed an issue where the description and image associated with a donation amount - [#233][]

[2.11.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.11.0...v2.11.1
[#233]: https://github.com/FuelRats/fuelrats.com/pull/233

## [2.11.0][] - 2020-04-13

### ✨ Added

* IP blocking for Donation API - [#230][]
* Rate limiting for Donation API - [#230][]

### ⚡ Changed

* Simplify a lot about the layout of the application - [#228][]
* Convert `UserMenu` back to a class for our sanity - [#228][]
* Remove `LocalForage` because it's no longer in use - [#228][]
* Convert to next.js builtin SCSS loading - [#228][]
* Make login button always gray so it doesn't pop out on the front page. - [#221][]
* Wrap all JSX string literals in a container (New ESLint Rule) - [#221][]
* Enforce consistent newline rules for JSX code containers (New ESLint Rule) - [#221][]
* Begin Splitting up blog list into different components (for our sanity) - [#221][]
* Update to `@fuelrats/next-named-routes` v3 for it's vastly superior syntax and better querystring handling - [#228][]
* Add priority to `sitemap.xml` entries.
* A ton of other style changes brought upon us by the release of `@fuelrats/eslint-config` v2 - [#221][]
* Setup a better structure for Donation API - [#230][]
* Fix up styling and output of donation page errors - [#230][]

### 🐛 Fixed

* Resolved a problem where certain changed values were not being taken into account when validating the paperwork form - [#226][]
* Updated maximum CMDR name length so those with long names can properly register - [#232][]

### ⚙ Tasks

* Update `@fuelrats/eslint-config` to `v2.1.0` - [#221][], [#228][]
* Replace `node-sass` in favor of `dart-sass` - [#222][]
* Restructure project to use a more standard file structure - [#223][], [#224][]
* Replace all-contributors-cli with the all-contributors GitHub bot - [#231][]
* Upgrade Rollup to v2.x - [#231][]
* Upgrade Node to v13.x - [#223][]

[2.11.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.10.0...v2.11.0
[#221]: https://github.com/FuelRats/fuelrats.com/pull/221
[#222]: https://github.com/FuelRats/fuelrats.com/pull/222
[#223]: https://github.com/FuelRats/fuelrats.com/pull/223
[#224]: https://github.com/FuelRats/fuelrats.com/pull/224
[#226]: https://github.com/FuelRats/fuelrats.com/pull/226
[#228]: https://github.com/FuelRats/fuelrats.com/pull/228
[#230]: https://github.com/FuelRats/fuelrats.com/pull/230
[#231]: https://github.com/FuelRats/fuelrats.com/pull/231
[#232]: https://github.com/FuelRats/fuelrats.com/pull/232

## [2.10.0-patch.2][2.10.0] - 2020-02-04

### 🐛 Fixed

* Fix Forgot password input being uneditable - [#219][]

[#219]: https://github.com/FuelRats/fuelrats.com/pull/219

## [2.10.0-patch.1][2.10.0]  - 2020-01-29

### 🐛 Fixed

* Fix donate page by removing recaptcha. We removed this due to seemingly unfixable inconsistencies across browsers. - [#218][]
* Fixed an error in paperwork edit permission checks. - [#217][]

[#217]: https://github.com/FuelRats/fuelrats.com/pull/217
[#218]: https://github.com/FuelRats/fuelrats.com/pull/218

## [2.10.0][] - 2020-01-28

### ✨ Added

* Add donation page and it's subsequent donation result page - [#210][]
* Add temporary donation API until APIv3 is out and we can use the new payments API we've been working on - [#210][]
* Add foundation for recaptcha to be used in neccessary places - [#210][]

### ⚡ Changed

* Replace remaining function refs with `React.CreateRef()` - [#209][]
* Further optimize various components by removing inline function attributes (now disallowed by eslint config) - [#209][]
* Re-order imports (enforced by eslint config) - [#209][]
* Move rat tag rendering func to separate helper function. This same code was repeated in various places - [#209][]
* Split router middleware into it's own directory for better route management - [#210][]
* Remove old webstore entirely. Just display disabled option for now showing that it will be back - [#210][]
* Remove antiquated code which used to handle updating blog list page - [#210][]
* Migrate to `next-named-routes@2.0.0` - [#215][]
* Other small refactors for code legibility or optimization - [#210][], [#215][]

### 🐛 Fixed

* Fix locations of metadata files. They were in static, not on root directory - [#210][]
* Fix disabled nav items so they never link to anything. We just want them sitting there looking pretty - [#210][]
* Fix wp-content proxy origin header setting - [#211][]

### ⚙ Tasks

* Update to Babel 7.8 to support optional chaining and nullish coalescing operators - [#216][]
* Add various new babel transform plugins to support new syntaxes - [#209][]
  * export-namespace-from
  * optional-catch-binding
* Remove do-expressions since they're kinda too new - [#216][]

[2.10.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.9.2...v2.10.0
[#209]: https://github.com/FuelRats/fuelrats.com/pull#209
[#211]: https://github.com/FuelRats/fuelrats.com/pull#211
[#215]: https://github.com/FuelRats/fuelrats.com/pull/215
[#216]: https://github.com/FuelRats/fuelrats.com/pull/216

## [2.9.2][] - 2020-01-12

### 🐛 Fixed

* Fix user session not being properly initialized after registration. - [#213][]

### ⚙ Tasks

* Upgrade to Node 12 LTS - [#210][], [#213][]

[2.9.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.9.1...v2.9.2
[#210]: https://github.com/FuelRats/fuelrats.com/pull/210
[#213]: https://github.com/FuelRats/fuelrats.com/pull/213

## [2.9.1][] - 2019-12-14

### 🐛 Fixed

* Fix decal panel not displaying redeemed decals - [#207][]
* Fix error when logging out from website - [#207][]
* Fix accessToken not being passed to the OAuth authorization page - [#207][]
* Fix registration page improperly checking platform input for value - [#207][]

[2.9.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.9.0...v2.9.1
[#207]: https://github.com/FuelRats/fuelrats.com/pull/207

## [2.9.0][] - 2019-12-14

### ✨ Added

* Allow `<TagsInput />` component to be disabled
* Add flavor text to radio options on Paperwork page
* Add link to "How to file cases" confluence article to paperwork edit page
* Add change password modal to profile page
* Add handling for API resource type "Users"
* Add reminder that nicknames which are active on irc cannot be registered

### ⚡ Changed

* Disable & Clear first limpet field when outcome is not set to success
* Rework action creators to use a new action compositing system instead of a convoluted mess of a master function
* Simplify how rats are added/removed to rescues
* Rework Redux store so that API resources are processed using a significantly more efficient master reducer
* Rewrite and simplify session handling
* Replace `next-routes` with Next.js Dynamic Routes + new named route library
* Adjust page transitions so they run a bit smoother between pages
* Rewrite `<RadioOptionsInput />` so it doesn't have to use deprecated lifecycle methods \o/
* Removed old checkout code to make way for new stuff later on
* Convert change password form into a modal
* Remove profile settings tab
* Various adjustments to input style
* Rewrite redux reducers using the `immer` library
* Rewrite action type names to follow redux style guide.
* Remove remaining usages of our `React.Component` wrapper class.
* Rewrite user menu to be more extensible and mobile friendly.
* Restructure version page a bit for consistency.
* Remove teespring link from webstore

### 🐛 Fixed

* Double check login form validity on Firefox. (This fixes firefox autofill)
* Prevent double onChange events in `<TagsInput />`
* Fix crash on paperwork pages when rescue ID does not exist
* Fix inconsistency in line-height property between application and modals
* Prevent a null value in rescue data causing an error

### ⚙ Tasks

* Add THIS changelog file. :)
* Upgrade to Next.js 9
  * Various adjustments made to site behavior due to changes in Next
* Stop linting styles in JS files
* Add tools for better redux debugging
* Update README badges.

[2.9.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.8.0...v2.9.0

## [2.8.0][] - 2019-07-15

### ⚡ Changed

* Version page no longer links to github commit comparison as that information is not easily accessible via teamcity :(
* Rewrite modals so they have transitions.. and work better
* Disable storefront while our quartermaster is away

### 🐛 Fixed

* Fix Privacy Policy links on `/register` and `/i-need-help`. Thanks @noctilucent-dev

### ⚙ Tasks

* Move website CI to our own teamcity instance. woo!
* We added stylelint to our tool chain, so our css is more betterer

[2.8.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.3...v2.8.0

## [2.7.3][] - 2019-06-27

### 🐛 Fixed

* Fix nickname password input.. we broke it.. oops...

[2.7.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.2...v2.7.3

## [2.7.2][] - 2019-06-26

### ✨ Added

* Add rat honors to leaderboard
* Add local pagination and rat name filtering to leaderboard
* New redesigned profile front page (that looks amazing)

### ⚡ Changed

* Remove old statistics page and everything related to them. Link to public grafana board instead
* Clean up Regex patterns/match stuff
* Clean up `<AppLayout />`, Move page transition to it's own component (`<PageLayout />`)
* Define custom next `_error` page instead of shoehorning our own in for no good reason
* Move `ImageLoaderWorker` to global state
* Change how carousel handles slide data so it plays nice with images loaded via global worker

### 🐛 Fixed

* Fix CSP for edge and older firefox versions
* Fix authorize page being hidden when preAuthorized
* Fix SSR rendering breaking on pages (react-spring bug fixed in v9)

[2.7.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.1...v2.7.2

## [2.7.1][] - 2019-06-16

### 🐛 Fixed

* Fix nickname input styles

[2.7.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.0...v2.7.1

## [2.7.0][] - 2019-06-11

### ✨ Added

* Front page slideshow/carousel
  * With image loading web worker logic by @EladKarni
* New rat manager so you can create, rename, and delete rats at will. (ship manager coming soon!)
* Rescue list/search page for overseer+
* Global state selectors to simplify redux state mapping
* Page url parameter for profile page tabs

### ⚡ Changed

* Redesigned paperwork view page
  * This is also @314numberpi's first major contribution as our latest tech rat! Welcome to the team
* Redesign store products page slightly so it's nicer to interact with
* Add rescue header and quotes to paperwork edit form
* Add simple page transitions. Now you're playing with (`react-spring`) power!
* Improved switch toggle by adding icons to better illustrate state
  * This has the added effect of also making the switch color-blind friendly
* Add tooltips/error messages to ValidatedFormInput - Thanks @EladKarni
* Display TOS/COC pages after the user attempts to submit registration form - Thanks @EladKarni!
* Automatically trim whitespace for IRC nicks and CMDR names - Thanks @EladKarni!
* Update TabbedPanel tab appearance
* removed an easter egg. (but it's okay since it was removed to make way for a real implementation of what the easter egg did.)
* unmount page from app if user logs out while on authenticated page

### 🐛 Fixed

* Fix up SCSS styles to comply with node-sass
* Fix store order listing page breaking when products/skus no longer exist
* Various other small bugfixes and overall improvments

### ⚙ Tasks

* Upgrade to Next 8
* Better project documentation
* Update project code style

[2.7.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.3...v2.7.0

## [2.6.3][] - 2018-12-19

### ⚡ Changed

* Clean up helper functions

### 🐛 Fixed

* Fix bug preventing proper registration flow

### ⚙ Tasks

* Update various dependencies

[2.6.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.2...v2.6.3

## [2.6.2][] - 2018-11-17

### ⚡ Changed

* Hide layout on authorize page when the user is pre-authorized
  * this is to ease the feeling of being "tossed around" when going through the oAuth flow
* Add "hidden" version information page
* Prefix all DefinePlugin globals

### 🐛 Fixed

* Fix login dialog min password length requirements

[2.6.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.1...v2.6.2

## [2.6.1][] - 2018-11-11

### 🐛 Fixed

* Fix rat global state filters
* Fix style-src CSP

[2.6.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.0...v2.6.1

## [2.6.0][] - 2018-11-10

### ✨ Added

* Add dark input fields
* Implement said dank (yes) input fields on the login dialog
* Implement opt-in login session saving

### ⚡ Changed

* expose dispatch and getState to the onComplete event handler for action creator templates

### 🐛 Fixed

* Fix nav styling

### ⚙ Tasks

* Fully transition to the new @fuelrats/eslint-config-react package
* Restructure project files

[2.6.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.5.2...v2.6.0

## [2.5.2][] - 2018-10-13

### ⚡ Changed

* Adjust code style to comply with updated ESLint stuff

### ⚙ Tasks

* Update ESLint stuff

[2.5.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.5.1...v2.5.2

## [2.5.1][] - 2018-10-11

### ⚡ Changed

* Move billing info from shipping info stage to order summary page
* Handle cases where the user changes their cart mid-order
* Introduce `sortPriority` metadata field for store products, letting us determine the view order
* Clean up currency string formation by defining a helper function to do it for us. (Get Money ( ͡° ͜ʖ ͡°))
* Hide attribute descriptors if no attributes for a product exist
* Make it more clear that our billing form is secured through stripe
* Clean up old cruft we don't use
* Remove packages which are no longer used
* Remove all i18n stuff as we have since decided not to translate the website
* Rename instances of `store` subdirectories to `storefront`. This is to avoid confusion between the redux store and the stripe storefront
* Clean up server modules, and only disable certain eslint rules instead of simply turning off eslint entirely for certain modules
* Clean up getActionOptions even further, and rename to buildActionOptions
* Forward dispatch and getState functions to action response handlers
* define an actionStatus enum type
  * this is currently only being used in the actionCreators file, however the plan is to convert all string comparisons to enum comparisons so eventually we can turn the strings into symbols
* rewrite blog retrieval logic AGAIN so we can fully remove isomorphic-fetch from the project

[2.5.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.5.0...v2.5.1

## [2.5.0][] - 2018-10-10

### ✨ Added

* Storefront + accompanying management pages
* Page locking by API permission feature. AppLayout will display a 401 error page if the current user lacks a specified permission
* Rewritten blog loading logic makes the blog 350% more bearable to load
* Automagically authorize requesting clients if the user has previously accepted access

### ⚡ Changed

* make various CSS changes to lower space usage in certain cases
* make LoginDialog more mobile friendly
* reword buttons on i-need-fuel __again__ so things are even easier to interpret
* re-style inputs to glow red when the field is required and empty, green if required and valid
  * This has also been applied to most other custom input fields like TagsInput
* Improve performance of statistics page by increasing the minimum rescue count to 50 for the rescues by system display
* preload authorize page data so we can remove a loading screen
* No longer assume administrators always have all permissions on the API
* Add 1Password to acknowledgements page
* Add a list of dependencies to the acknowledgements page
* Clean up `<AppLayout />` and move user initialization to it's own helper module
* Use dectorators for page flagging and the connect helper function to make our lives a little easier
* rewrite getActionOptions in ActionCreators to make it easier to read and perhaps a bit faster
* remove uglify step in `next.config.js` as next already does that for us on production builds

### 🐛 Fixed

* Fix authorize page scope list so that accessible client scopes actually display as accessible scopes
* Fix bug in the blog page where removing a filter without reloading the page fully results in the filter staying on
* Properly display next/error page when response code is set to an error value

### ⚙ Tasks

* Migrate to NextJS 7
* Migrate to ESlint 5
* Update ESLint rules, and code to reflect changes in enforced rules
* Add `<React.StrictMode />` to the app root so we can identify problematic components.

[2.5.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.3...v2.5.0

## [2.4.3][] - 2018-08-27

### ⚡ Changed

* update rat kiwi link

### 🐛 Fixed

* Properly display inaccessible oAuth scopes

[2.4.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.2...v2.4.3

## [2.4.2][] - 2018-08-24

### ✨ Added

* Add "rat links" nav section for logged in rats
* Add code for deleting nicks, however due to various problems with our current method of nick management, this has been left disabled until we have transitioned to LDAP / Atheme
* Add a first-time welcome message which links new users to the new rat documents

### ⚡ Changed

* Move register button to below the "get help" button
* Continue making register page more clear that it isn't for clients... because people don't get it
* Remove subnav state tracking from global state since the sidebar is now a persistent element
* Fix eslint to allow react fragment shorthand syntax <>...</>
* Prevent PS4 browser users from raising a r-sig, provide additional instructions on how
  * kiwi client does not work on PS4 browser
  * It's better to have them move to a phone or computer
* Rewrite various bits of code to keep in line with new rules enforced by airbnb style guides
  * A few were disabled because even airbnb went back on the specific rules due to how silly they were
  * Others are generally better for efficiency and play better with the soon-to-be async nature of react

### 🐛 Fixed

* Fix ADD_NICKNAME and CREATE_RAT reducers so they actually update lists properly

[2.4.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.1...v2.4.2

## [2.4.1][] - 2018-07-27

### ⚡ Changed

* Remove some unused code

### 🐛 Fixed

* Fix ToS title typo
* Fix authentication redirects
* Remove debug output that shouldn't have been left in
* Prevent crash on paperwork page when system is null

[2.4.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.0...v2.4.1

## [2.4.0][] - 2018-05-28

### ✨ Added

* Attempt to display wordpress page of the same slug when the page does not exist on the website
* other fun things

### ⚡ Changed

* Rewrite Page component to a wrapper child element

[2.4.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.3.2...v2.4.0

## [2.3.2][] - 2018-05-24

### 🐛 Fixed

* Fix oauth page error caused by sending the wrong args to function

[2.3.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.3.1...v2.3.2

## [2.3.1][] - 2018-05-23

### ⚡ Changed

* Only show rats with rescues on the leaderboard

### 🐛 Fixed

* Fix favicon meta
* properly provide browserconfig, sitemap, and manifest files

[2.3.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.3.0...v2.3.1

## [2.3.0][] - 2018-05-22

### ✨ Added

* Add paperwork edit button
* Add paperwork error messages
* Add social media icons
* Add merch link (rushed release due to this)
* Easter Egg

### ⚡ Changed

* Redo paperwork component
* Upgrade to next 6
* Introduce server-side data fetching, starting with paperwork

[2.3.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.2.0...v2.3.0

## [2.2.0][] - 2018-05-13

### ✨ Added

* New Privacy Policy

### ⚡ Changed

* Update registration process to be GDPR Compliant
* Reworked nav layout
* Rewrite dialogs to support a more responsive layout
* Improve wording on paperwork page
* Improve mobile support

[2.2.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.9...v2.2.0

## [2.1.9][] - 2018-04-16

### 🐛 Fixed

* Fix errors that occur during password resets and registration

[2.1.9]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.8...v2.1.9

## [2.1.8][] - 2018-03-27

### ✨ Added

* Donation page

[2.1.8]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.7...v2.1.8

## [2.1.7][] - 2018-04-11

### ✨ Added

* Add link directly to the blog's art category
* Implement `next-routes` for better routing
* Better error display and handling for certain cases
* New radio input for styled choice inputs
* Add epic resource handling
* Add epic submission page (disabled for now)

### ⚡ Changed

* Always submit rescue system as a capitalized system name
* Prefer token cookies over LocalForage

[2.1.7]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.6...v2.1.7

## [2.1.6][] - 2018-01-18

### ⚡ Changed

* Change all instances of the word "Login" to "Rat Login"
* Change all instances of the word "Register" to "Become a Rat"
  * Both of these changes were made in interest of removing confusion for clients

[2.1.6]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.5...v2.1.6

## [2.1.5][] - 2018-01-17

### ✨ Added

* Introduce acknowledgements page to credit those who have helped us so much

[2.1.5]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.4...v2.1.5

## [2.1.4][] - 2018-01-10

### 🐛 Fixed

* Correctly set CR and system fields in paperwork

[2.1.4]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.3...v2.1.4

## [2.1.3][] - 2017-11-14

### ⚡ Changed

* Swap to new TravisCI webhook

### 🐛 Fixed

* Fix Routing error caused by trailing slashes in paths
* Send correct oAuth decision to API when denying oAuth authorization

[2.1.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.2...v2.1.3

## [2.1.2][] - 2017-10-09

### ✨ Added

* Restore IRC nick registration
* IRC notifications to #rattech for Travis builds

### 🐛 Fixed

* Fix hero display on small screens

[2.1.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.1...v2.1.2

## [2.1.1][] - 2017-10-05

### ⚡ Changed

* Temporarily disable nickname registration

[2.1.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.0...v2.1.1

## [2.1.0][] - 2017-10-05

### ✨ Added

* OAuth page
* IRC Nickname registration

[2.1.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.0.1...v2.1.0

## [2.0.1][] - 2017-09-11

### ✨ Added

* Password field suggestions and warnings

### ⚡ Changed

* Made  - Thanks @Spansh

[2.0.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.0.0...v2.0.1

## [2.0.0][] - 2017-09-09

* Initial Release

[2.0.0]: https://github.com/FuelRats/fuelrats.com/releases/tag/v2.0.0

## Previous Major Versions

v1.0 refers to our old wordpress-based hybrid site which had major problems and wasn't very extensible in the long run.

We look back on that old website fondly, but alas technology must continue moving forward.

also... react is cooler, yo.
