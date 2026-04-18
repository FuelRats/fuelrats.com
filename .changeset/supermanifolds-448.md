---
"fuelrats.com": major
---

Major modernization of the Fuel Rats website with new features, infrastructure overhaul, and comprehensive quality improvements.

### New Features

#### Dispatch Board
- **Sound notifications** — configurable audio alerts for new cases, case updates, and Code Red, with per-event toggles, volume control, and preview. Sounds are synthesized via Web Audio API (no audio files).
- **Push notifications** — subscribe to browser push notifications for rescue alerts with platform (PC/Xbox/PS) and game version (Legacy/Horizons/Odyssey) filters, and a dispatch-alerts-only vs all-rescues toggle. Bell button on the dispatch board opens a notification settings panel.
- **Skeleton loading rows** — replace the old spinner with shimmer placeholder rows while the board loads.
- **Keyboard navigation** — j/k/arrows to navigate rescues, 0-9 to jump to case numbers, Esc to close details, Home/End for first/last.
- **Mobile-friendly layout** — card-style rescue rows below 700px, stacked detail info, responsive quote rows, tighter margins.
- **Socket reconnect refresh** — debounced board re-fetch after WebSocket reconnects.
- **Auto-open new rescues** — newly arriving rescues automatically open in the detail panel.
- **Live regions** — socket status and new rescue announcements via `aria-live` for screen readers.
- **Load error handling** — error banner with reload button if the board fails to load.

#### Rescue Details
- **Star system info** — star description, cardinal direction from landmark, scoopable star indicator.
- **External links** — EDSM and Spansh plotter links (Spansh only for distant systems).
- **Quote improvements** — bot event detection and collapsing, relative timestamps, monospace quote indices.
- **Fleet carrier indicator** — carrier icon in the rats field.
- **Language region** — flag emoji and country name alongside language code.
- **Rescue ID emphasis** — monospace, centered, red background for Code Red.

#### User Avatars
- **Inline rat avatars** — user avatars shown next to rat names across dispatch table, rescue details, paperwork, leaderboard, and tag inputs.
- **Broken image fallback** — custom `UserAvatar` component falls back to adorable-avatars on load error.
- **Leaderboard avatars** — 32px circular avatars next to each name.

#### Security & Authentication
- **TOTP two-factor authentication** — QR code setup, 6-digit verification, enable/disable from Security tab.
- **Recovery codes** — 10 one-time-use recovery codes displayed at TOTP setup, with copy/download options and regeneration support.
- **Recovery code login** — "Use a recovery code instead" toggle on the TOTP login screen.
- **Active session management** — view all sessions with device/browser (parsed via ua-parser-js), IP, last seen time, auth method. Revoke individual sessions or sign out everywhere else.
- **Passkey support** — WebAuthn passkey registration and login.
- **IRC certificate download** — generate and download SSL client certificates.
- **Suspended account handling** — 410 Gone errors now show "Account Suspended" with ops@fuelrats.com contact, and properly log out the session.

#### Push Notifications (Profile)
- **Push subscription management** — enable/disable per device, per-platform and per-expansion filter toggles, delete individual subscriptions.

#### Navigation
- **Breadcrumbs** — admin and profile sub-tabs show breadcrumb navigation.
- **"Back to Dispatch" link** — paperwork pages show a back link when navigated from the dispatch board, preserving the rescue context.
- **My Rescues** — added to the user menu sidebar.
- **Removed broken admin Rescues link** from user menu.

#### PWA
- **Installable dispatch board** — manifest with start_url `/dispatch`, service worker for push notification support, "Install app" button.
- **iOS standalone** — `apple-mobile-web-app-capable` meta tags.

### Infrastructure & Build

- **Bun package manager** — migrated from npm/yarn.
- **SWC compiler** — replaced Babel with SWC, removed `@fuelrats/babel-plugin-classnames` (migrated all `className={[...]}` to `clsx()`).
- **Docker multi-stage builds** — separate `dev` and `prod` targets, no runtime NODE_ENV conditionals in the image.
- **`NEXT_PUBLIC_*` env vars** — migrated from deprecated `publicRuntimeConfig` to compile-time environment variables.
- **ESLint fully clean** — replaced crashing `eslint-import-resolver-alias` with a custom Bun-compatible resolver, added JSX and decorator parser support, resolved all 479 pre-existing violations.

### Refactors

- **Class → function components** — converted all remaining class components to function components with hooks (LoginModal, paperwork pages, ValidatedFormInput, RatCard, TagsInput, NProgress, and more).
- **TagsInput rewrite** — 592-line class component → ~423-line function component with composition pattern.
- **Paperwork edit split** — 770-line edit page → 280 lines via extraction of `usePaperworkChanges` hook, `PaperworkFormFields` component, and `useUnsavedChangesGuard` hook.
- **Dropped `hoist-non-react-statics`** — copy statics explicitly.
- **Dropped `react-copy-to-clipboard`** — replaced with native Clipboard API.
- **Dropped homegrown `isEqual`** — replaced with `lodash/isEqual`.
- **Replaced `SilentBoundary`** — with `react-error-boundary` library (`PageErrorBoundary` with reload fallback).
- **Consolidated platform badges** — unified around `PlatformBadge` component.
- **Cached systems API responses** — Redux `sapi` slice for star system data and landmarks.
- **Per-rescue memoized selectors** — `createCachedSelector` keyed by rescueId to prevent unnecessary re-renders.
- **Inlined `useSelectorWithProps`** — deleted the hook.
- **Unified form folder layout** — consistent folder-style structure in `src/components/Forms/`.

### Error Handling

- **`friendlyApiError` utility** — centralized error-to-message mapping with pointer and status overrides.
- **Expanded `apiErrorLocalisations`** — covers all API status codes (forbidden, conflict, gone, unprocessable_entity, authenticator_required, etc.).
- **Comprehensive audit** — eliminated silent failures across dispatch board, paperwork, profile panels, admin pages, leaderboard, blog, and CMS content. Every API dispatch now handles errors visibly.
- **Banned name errors** — rat and nickname forms surface "This name is not allowed" from the API.

### Accessibility

- **`prefers-reduced-motion`** — respects user preference, disables animations.
- **ARIA labels** — icon-only buttons (CarrierIcon, scoopable, language flag, close buttons) now have accessible names.
- **Modal focus trapping** — `useFocusTrap` hook with Tab/Shift+Tab interception and focus restoration; `aria-modal` and `aria-labelledby` on all modals.
- **`.sr-only` utility** — visually-hidden-but-announced CSS class.
