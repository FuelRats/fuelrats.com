# fuelrats.com Changelog

All changes relative to the previous version of fuelrats.com shall be documented in this file.

For detailed rules of this file, see  [Changelog Rules](#changelog-rules)





## [Unreleased]

### ✨ Added

### ⚡ Changed
* Make login button always gray so it doesn't pop out on the front page. - [#221][]
* Wrap all JSX string literals in a container (New ESLint Rule) - [#221][]
* Enforce consistent newline rules for JSX code containers (New ESLint Rule) - [#221][]
* Begin Splitting up blog list into different components (for our sanity) - [#221][]
* A ton of other style changes brought upon us by the release of `@fuelrats/eslint-config` v2 - [#221][]

### 🐛 Fixed

### ⚙ Tasks
* Update `@fuelrats/eslint-config-react` to `v2.0.0` - [#221][]
* Replace `node-sass` in favor of `dart-sass` - [#222][]
* Restructure project to use a more standard file structure - [#223][]
* Upgrade to Node 13 - [#223][]


[#221]: https://github.com/FuelRats/fuelrats.com/pull/221
[#222]: https://github.com/FuelRats/fuelrats.com/pull/222
[#223]: https://github.com/FuelRats/fuelrats.com/pull/223





## [2.10.0-patch.2] - 2020-02-04

### 🐛 Fixed
* Fix Forgot password input being uneditable - [#219][]


[#219]: https://github.com/FuelRats/fuelrats.com/pull/219





## [2.10.0-patch.1] - 2020-01-29

### 🐛 Fixed
* Fix donate page by removing recaptcha. We removed this due to seemingly unfixable inconsistencies across browsers. - [#218][]
* Fixed an error in paperwork edit permission checks. - [#217][]


[#217]: https://github.com/FuelRats/fuelrats.com/pull/217
[#218]: https://github.com/FuelRats/fuelrats.com/pull/218





## [2.10.0] - 2020-01-28

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


[#209]: https://github.com/FuelRats/fuelrats.com/pull#209
[#215]: https://github.com/FuelRats/fuelrats.com/pull/215
[#216]: https://github.com/FuelRats/fuelrats.com/pull/216





## [2.9.2] - 2020-01-12

### 🐛 Fixed
* Fix user session not being properly initialized after registration. - [#213][]

### ⚙ Tasks
* Upgrade to Node 12 LTS - [#210][], [#213][]


[#210]: https://github.com/FuelRats/fuelrats.com/pull/210
[#213]: https://github.com/FuelRats/fuelrats.com/pull/213





## [2.9.1] - 2019-12-14

### 🐛 Fixed
* Fix decal panel not displaying redeemed decals - [#207][]
* Fix error when logging out from website - [#207][]
* Fix accessToken not being passed to the OAuth authorization page - [#207][]
* Fix registration page improperly checking platform input for value - [#207][]


[#207]: https://github.com/FuelRats/fuelrats.com/pull/207





## [2.9.0] - 2019-12-14

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





## [2.8.0] - 2019-07-15

### ⚡ Changed
* Version page no longer links to github commit comparison as that information is not easily accessible via teamcity :(
* Rewrite modals so they have transitions.. and work better
* Disable storefront while our quartermaster is away

### 🐛 Fixed
* Fix Privacy Policy links on `/register` and `/i-need-help`. Thanks @noctilucent-dev

### ⚙ Tasks
* Move website CI to our own teamcity instance. woo!
* We added stylelint to our tool chain, so our css is more betterer





## [2.7.3] - 2019-06-27

### 🐛 Fixed
* Fix nickname password input.. we broke it.. oops...





## [2.7.2] - 2019-06-26

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





## [2.7.1] - 2019-06-16

### 🐛 Fixed
* Fix nickname input styles





## [2.7.0] - 2019-06-11

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





## [2.6.3] - 2018-12-19

### ⚡ Changed
* Clean up helper functions

### 🐛 Fixed
* Fix bug preventing proper registration flow

### ⚙ Tasks
* Update various dependencies





## [2.6.2] - 2018-11-17

### ⚡ Changed
* Hide layout on authorize page when the user is pre-authorized
    * this is to ease the feeling of being "tossed around" when going through the oAuth flow
* Add "hidden" version information page
* Prefix all DefinePlugin globals

### 🐛 Fixed
* Fix login dialog min password length requirements





## [2.6.1] - 2018-11-11

### 🐛 Fixed
* Fix rat global state filters
* Fix style-src CSP





## [2.6.0] - 2018-11-10

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





## [2.5.2] - 2018-10-13

### ⚡ Changed
* Adjust code style to comply with updated ESLint stuff

### ⚙ Tasks
* Update ESLint stuff





## [2.5.1] - 2018-10-11

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





## [2.5.0] - 2018-10-10

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





## [2.4.3] - 2018-08-27

### ⚡ Changed
* update rat kiwi link

### 🐛 Fixed
* Properly display inaccessible oAuth scopes





## [2.4.2] - 2018-08-24

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





## [2.4.1] - 2018-07-27

### ⚡ Changed
* Remove some unused code

### 🐛 Fixed
* Fix ToS title typo
* Fix authentication redirects
* Remove debug output that shouldn't have been left in
* Prevent crash on paperwork page when system is null





## [2.4.0] - 2018-05-28

### ✨ Added
* Attempt to display wordpress page of the same slug when the page does not exist on the website
* other fun things

### ⚡ Changed
* Rewrite Page component to a wrapper child element





## [2.3.2] - 2018-05-24

### 🐛 Fixed
* Fix oauth page error caused by sending the wrong args to function





## [2.3.1] - 2018-05-23

### ⚡ Changed
* Only show rats with rescues on the leaderboard

### 🐛 Fixed
* Fix favicon meta
* properly provide browserconfig, sitemap, and manifest files





## [2.3.0] - 2018-05-22

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





## [2.2.0] - 2018-05-13

### ✨ Added
* New Privacy Policy

### ⚡ Changed
* Update registration process to be GDPR Compliant
* Reworked nav layout
* Rewrite dialogs to support a more responsive layout
* Improve wording on paperwork page
* Improve mobile support





## [2.1.9] - 2018-04-16

### 🐛 Fixed
* Fix errors that occur during password resets and registration





## [2.1.8] - 2018-03-27

### ✨ Added
* Donation page





## [2.1.7] - 2018-04-11

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





## [2.1.6] - 2018-01-18

### ⚡ Changed
* Change all instances of the word "Login" to "Rat Login"
* Change all instances of the word "Register" to "Become a Rat"
    * Both of these changes were made in interest of removing confusion for clients





## [2.1.5] - 2018-01-17

### ✨ Added
* Introduce acknowledgements page to credit those who have helped us so much





## [2.1.4] - 2018-01-10

### 🐛 Fixed
* Correctly set CR and system fields in paperwork





## [2.1.3] - 2017-11-14

### ⚡ Changed
* Swap to new TravisCI webhook

### 🐛 Fixed
* Fix Routing error caused by trailing slashes in paths
* Send correct oAuth decision to API when denying oAuth authorization





## [2.1.2] - 2017-10-09

### ✨ Added
* Restore IRC nick registration
* IRC notifications to #rattech for Travis builds

### 🐛 Fixed
* Fix hero display on small screens





## [2.1.1] - 2017-10-05

### ⚡ Changed
* Temporarily disable nickname registration





## [2.1.0] - 2017-10-05

### ✨ Added
* OAuth page
* IRC Nickname registration





## [2.0.1] - 2017-09-11

### ✨ Added
* Password field suggestions and warnings

### ⚡ Changed
* Made  - Thanks @Spansh





## [2.0.0] - 2017-09-09
* Initial Release



## Previous Major Versions
v1.0 refers to our old wordpress-based hybrid site which had major problems and wasn't very extensible in the long run.

We look back on that old website fondly, but alas technology must continue moving forward.

also... react is cooler, yo.


## Changelog Rules

basic format:

```
* message - [#pr1][], [#pr2][] - @externalContributor
```

* Entries must be easy to consume. Complex changes should be split up or made into a sublist of changes.
* Entries for changes made by external contributors should be attributed via mention.
    * Changes made by team members should **not** be attributed.
* Entries must contain links to all PRs to `develop` which contribute to the change.
    * Changes made before 2.9.1 are kinda exempt right now. We're adding them over time.
* Entries must be grouped using the following groups:
    * **✨ Added** - For new features and additions.
    * **⚡ Changed** - For any changes to existing features, or removal of old ones.
    * **🐛 Fixed** - For bug fixes
    * **⚙ Tasks** - Chores relating to the upkeep of the project or repository. (documentation, dependencies, etc.)





[Unreleased]: https://github.com/FuelRats/fuelrats.com/compare/v2.10.0...HEAD
[2.10.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.9.2...v2.10.0
[2.9.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.9.1...v2.9.2
[2.9.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.8.0...v2.9.0
[2.8.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.3...v2.8.0
[2.7.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.2...v2.7.3
[2.7.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.1...v2.7.2
[2.7.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.3...v2.7.0
[2.6.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.2...v2.6.3
[2.6.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.1...v2.6.2
[2.6.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.6.0...v2.6.1
[2.6.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.5.2...v2.6.0
[2.5.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.5.1...v2.5.2
[2.5.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.3...v2.5.0
[2.4.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.3.2...v2.4.0
[2.3.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.9...v2.2.0
[2.1.9]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.8...v2.1.9
[2.1.8]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.7...v2.1.8
[2.1.7]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.6...v2.1.7
[2.1.6]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.5...v2.1.6
[2.1.5]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.4...v2.1.5
[2.1.4]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/FuelRats/fuelrats.com/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/FuelRats/fuelrats.com/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/FuelRats/fuelrats.com/releases/tag/v2.0.0
