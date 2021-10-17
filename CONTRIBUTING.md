# Contributing

You want to contribute to fuelrats.com? Awesome!

## Some things to know

By contributing to this repository, you are expected to know and follow the rules of general conduct outlined in our [Terms of Service][fuelrats-tos]. While not all rules are applicable in the context of github, we still expect the same level of professional behavior detailed by our ToS.

**Working on your first Pull Request?**
[How to Contribute to an Open Source Project on GitHub][egghead]

## How do I...

* Request a feature?
  [Submit it!][fr-issues-new]

* Report a bug?
  [Let us know!][fr-issues-new]

* Setup a development enviornment?
  [We've got you covered!](#project-setup)

* Submit a PR?
  [Learn more here!](#code-contributions)


## Project setup

1. Install Node.js and `npm` (if you haven't already).
    * [`nvm`](#nvm-install) is recommended for Linux/WSL/macOS.
    * Node for Windows is available [here](#node-install), but you should probably be using WSL or some other linux-based CLI alternative.
    * Current version requirement is: `^16.0.0`.
1. Install Yarn (if you haven't already).
    * Run: `npm i -g yarn`
1. Fork and clone the repo
    * Hit "Fork" in the upper left corner of the github page.
    * Run: `git clone https://github.com/<your username>/fuelrats.com`
1. Setup environment variables (detailed in ["Dev environment configuration"](#dev-environment-configuration))
1. In the project directory, run `yarn install` to install dependencies.
1. Run `yarn dev` to start the dev server.

> Warning: Use of `npm` as a package manager is **NOT** supported.

> Tip: Keep your `develop` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```bash
> git remote add upstream https://github.com/FuelRats/fuelrats.com.git
> git fetch upstream
> git branch --set-upstream-to=upstream/develop develop
> ```
>
> This will add the original repository as a "remote" called "upstream,"
> Then fetch the git information from that remote, then set your local `develop`
> branch to use the upstream develop branch whenever you run `git pull`.
> Then you can make all of your pull request branches based on this `develop`
> branch. Whenever you want to update your version of `develop`, do a regular
> `git pull`.

### Dev environment configuration

You'll need to set a few environment variables to get the website running properly. In development, environment variables are automatically loaded through the `.env.local` file. Follow these steps to setup this file:

1. Duplicate the `.env.local.template` file located in the root directory, and rename it to `.env.local`.
1. Replace the following variables with the values provided to you by a project maintainer. Don't have any values to set? Contact the TechRats over IRC!
    * FR_API_KEY
    * FR_API_SECRET
    * FR_STRIPE_API_PK
    * FR_STRIPE_API_SK
1. Optionally, you may also set `REACT_EDITOR` to the editor of your choice so the website's error overlay can link you directly to code. By default this is set to `code` for VSCode.


## Code Contributions

Please, *please*, ***please*** get some feedback from the TechRats and/or the ops team before you write any code. Don't waste your time building a feature that's already been struck down. Search our existing [issues][fr-issues] for a related issue, or [create a new one][fr-issues-new] if none exists.

Before beginning work on your first contribution, you should read through this document to make the process as straightforward as possible.


### Development flow

Once you have an issue to work on, follow these steps to get you off the ground.

1. If this is your first contribution, follow ["Project Setup"](#project-setup) above.
1. Create a new working branch off of `develop` on your own fork.
1. Do the work required to satisfy the issue. If work unrelated to the objective needs to be done, discuss it in the issue before proceeding.
1. Commit your changes following our [Commit Conventions](#commit-conventions).
1. Before creating your PR, ensure you have followed the [ PR Checklist](#submitting-a-pr) below.
1. Submit PR to merge back into `develop`.
    * When ready, A review should be requested from the `FuelRats/web` team.
1. After the PR has been merged and deployed, double check your work on the [staging preview website][testsite].


### Submitting a PR

So you've got a working branch all ready to go? great! Before submitting, make sure you've followed this checklist.

- This PR was created to resolve an existing issue or set of issues.
- This PR satisfies any and all acceptance criteria laid out by issue(s) it resolves.
- I have discussed creating this PR with the maintainers in the issue(s) beforehand.
- I have thoroughly tested the changes this PR introduces in a local development enviornment.
- I have linted the entire codebase using `yarn lint` and confirmed there are no errors or warnings.
- I have followed the commit conventions laid out by the [Commit Conventions](#commit-conventions) section below.


### Being added as a contributor

When you create your first pull request we will add you as a contributor as per [All Contributors][all-contributors] convention.
If you have created an issue but not a PR, you will be added along with the PR that closes your issue.

If you do not wish to be added to the contributors list, Please specify in the pull request or GitHub issue.
The pull request template contains a section specifically for this.





## Commit conventions

Commits should be as small as possible, with exceptions for large sweeping changes required by lint rule changes, package updates, etc.

Please follow the gitmoji commit format when submitting code.

```
<😎...> [(scope):] <title>

[detailed message]
```
* `<😎...>` - gitmoji(s) that best represent this change. [See below for more info](#gitmoji).
    * You're not limited to a single emoji! Use as many as neccessary, but keep in mind that commits should remain simple enough to only require one.
* `[(scope):]` - Optional, but helpful. When used the scope should follow [these rules](#commit-scopes).
    * Remain as consistent in naming as possible. Use git history as precedence for the scope given to a file.
    * If the commit makes changes to two or more **completely unrelated** files, the component scope should not be included.
* `<title>` - A quick summary of changes made. If there are multiple changes, Use the detailed message section to fully explain the commit.
  * Please use the present tense and imperative mood. (e.g. "rewrite `someFunction()` to improve performance")
* `[detailed message]` - An optional more in depth explaination of the commit.

### gitmoji

gitmoji is a standard list of emoji to represent the different types of changes we make to our project. [Check out the full list!](https://gitmoji.dev/).

Using the website as a cheatsheet is fine, but if you're unfamiliar with gitmoji, try using [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli). This tool will help you construct commit messages in the format detailed above using `gitmoji -c`.

Be sure to run `gitmoji -g` to configure the tool. We recommend the following options:

* **Enable automatic "git add ."**: No
* **Select how emojis should be used in commits**: 😄 (direct emoji chars, not text.)
* **Enable signed commits**: (Dependant on if you use gpg)
* **Enable scope prompt**: Yes

### Commit Scopes

Scopes help give commit messages further context in a concise way, and are helpful when navigating commit history.

If in doubt about scoping, try to dive into the commit history for the file in question. Ultimately ask if you're still confused. Use your best judgement, but prefer consistency over enforcing the rules set by this document. the point of these rules is to make searching through commits easier, and consistency helps the most.

#### Files not requiring a scope suffix

* Any React `<Component />` (e.g. `✨ (MyComponent): ...`)
* Any React hook (e.g. `♻️ (useSelectorWithProps): ...`)
* Any documentation file, however use `.md` in the scope name. (e.g. `📝 (CONTRIBUTING.md): ...`)

#### Scope Suffixes

Scopes with a type suffix will generally follow the name of the directory that contains them. The following list should be exhaustive, but if one may be missing, please ask the maintainers.

> `~` = `projectRoot/src`

* `-data` - Modules found in `~/data`. These files, intuitively, contain data objects.
* `-page` - Page components found in `~/pages`, with the exception of `~/pages/api`.
* `-route` - API page routes found in `~/pages/api`.
* `-service` - "Service" modules found in `~/services`.
* `-actions` - Redux store actions found in `~/store/actions`.
* `-selectors` - Redux store selectors found in `~/store/selectors`.
* `-reducer` - Redux store reducer functions found in `~/store/reducers`.
* `-util` - General purpose utility modules found in `~/util`.
* `-worker` - WebWorker modules found in `~/workers`.
* `-types` - `.d.ts` Typing files found in `/typings`.
* `-scss` - any `.scss` file anywhere in the project.
    * Styles found in component directories **MAY** be committed under the related component scope, however.
* `-static-<fileType>` - static assets found in `/public`. file type may be generic descriptor or specific extension. (i.e. `favicon-static-image`, `sitemap-static-xml`)
* `-conf` - Any project config file. Either on the top level, or in `/.config`. (i.e. `eslint-conf`, `next-conf`, `postcss-conf`)



## Primary Repo Development

These rules pertain to development on the main `FuelRats/fuelrats.com` repository, and do not need to be followed by forks.

### Development flow

1. Branch from `develop` using the [branch conventions below](#branch-convensions).
1. Do the work required to satisfy the Ticket or objective. If work unrelated to the objective needs to be done, make a separate branch.
1. Document the changes introduced from the previous release in `CHANGELOG.md`.
1. Submit PR to merge back into `develop`.
    * Any change which would affect current development should be documented in the description.
    * Assign the PR to yourself.
    * The PR should be labeled with the label most fitting to the type of work. If the PR is a bugfix which must be merged to fix a major problem, it should be labeled `Urgent`.
    * When the PR is ready to be merged, A review should be requested from the `FuelRats/web` team.
1. Once the PR is approved, it is the responsibility of the **assignee** to merge the changes to the branch.
1. After the build has been deployed, double check your changes on the [staging preview website][testsite].

### Branch Conventions

Work branches on the **main repo** are expected to follow this branch format:

```
type/objective
```
* **type** - The type of work being done. See below for types.
* **objective** - a simple and breif descriptor of the work being done. words should be hyphen-delimited. e.g. `fix-paperwork`, `redesign-profiles`, `add-avatars`

#### Branch types
* `feat` - New feature.
* `fix` - Bug fix.
* `refactor` - A change in behavior of existing code.
* `docs` - A change in project documentation.
* `style` - A change which **only** fixes code style and not behavior.
* `chore` - Maintenance tasks such as updating dependencies.
* `experiment` - A new feature idea or major structural change which has a questionable outcome.





[fuelrats-tos]: https://fuelrats.com/terms-of-service
[all-contributors]: https://github.com/kentcdodds/all-contributors
[testsite]: https://fuelrats.dev/
[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[new-pr]: https://github.com/FuelRats/fuelrats.com/compare
[ops-email]: mailto:ops@fuelrats.com
[nvm-install]: https://github.com/nvm-sh/nvm#installing-and-updating
[node-install]: https://nodejs.org/en/
[fr-issues]: https://github.com/FuelRats/fuelrats.com/issues
[fr-issues-new]: https://github.com/FuelRats/fuelrats.com/issues/new/choose
