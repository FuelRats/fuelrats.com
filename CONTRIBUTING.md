# Contributing

You want to contribute to the project? Awesome!

## Things to know

By contributing to this repository, you are expected to know and follow the rules of general conduct outlined in our [Terms of Service][fuelrats-tos]. While not all rules are applicable in the context of github, we still expect the same level of professional behavior detailed by our ToS.

**Working on your first Pull Request?**
[How to Contribute to an Open Source Project on GitHub][egghead]

## How do

* Project setup?
  [We've got you covered!](#project-setup)

* Found a bug?
  [Let us know!][bugs]

* Patched a bug?
  [Make a PR!][new-pr]

* Adding a new feature?
  Please, *please*, ***please*** get some feedback from the tech rats and/or the ops team before you write any code. Don't waste your time building a feature that's already been struck down.

## Project setup

1. Install Node.js and `npm` (if you haven't already).
    * [`nvm`](#nvm-install) is recommended for Linux/WSL/macOS.
    * Node for Windows is available [here](#node-install), but you should probably be using WSL or some other linux-based CLI alternative.
    * Current version requirement is: `^14.0.0`.
1. Install Yarn (if you haven't already).
    * Run: `npm i -g yarn`
1. Fork and clone the repo
    * Hit "Fork" in the upper left corner of the github page.
    * Run: `git clone https://github.com/<your username>/fuelrats.com`
1. Setup environment variables (detailed in ["Dev environment setup"](#dev-environment-setup))
1. In the project directory, run `yarn install` to install dependencies.
1. Run `yarn dev` to start the dev server.

> Use of `npm` as a package manager is **NOT** supported by this repository.

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

### Dev environment setup

You'll need to set a few environment variables to get the website running properly. `Next.js` loads environment variables automaitcally for us from a file called `.env.local`. Follow these steps to set that file up:

1. Duplicate the `.env.local.template` enviornment file located in the root directory.
1. Rename it to `.env.local`.
1. Replace the following variables with the values provided to you by a project maintainer. Don't have any values to set? Contact the TechRats over IRC!
    * FRDC_API_KEY
    * FRDC_API_SECRET
    * FRDC_STRIPE_API_PK
    * FRDC_STRIPE_API_SK
1. Optionally, you can also set `REACT_EDITOR` to the editor of your choice so the website's error overlay can link you directly to erroring code. By default this is set to `code` for VSCode.

## Being added as a contributor

When you create your first PR we will add you as a contributor as per [All Contributors][all-contributors] convention.
If you have made a bug report, you will be added along with the PR that fixes the bug. (Assuming you have a GitHub account!)

If you do not wish to be added, please let us know.


## Contributing as an Organization member

Below are steps which **MUST** be followed by all Fuel Rats org members. External collaborators only have to follow the above guidelines, but encouraged to adopt these same practices for consistency.

### Steps for development

1. Branch from `develop` using the formatting rules below.
1. Do the work required to satisfy the Ticket or objective. If work unrelated to the objective needs to be done, make a separate branch.
1. Document the changes introduced from the previous release in `CHANGELOG.md`.
1. Submit PR to merge back into `develop`.
    * Any change which would affect current development should be documented in the description.
    * PRs for a ticket should be tagged in the title with the ticket. IE: `[WEB-##] Fix bug`
    * Assign the PR to yourself. (If you cannot, leave it for someone who can)
    * The PR should be labeled with the label most fitting to the type of work. If the PR is a bugfix which must be merged to fix a major problem, it should be labeled `Urgent`.
    * When the PR is ready to be merged, A review should be requested from the `FuelRats/web` team.
1. Once the PR is approved, it is the responsibility of the **assignee** to merge the changes to the branch.
1. After the build has been deployed, test the changes on the [staging preview website][testsite].
1. Once the change is confirmed working, delete the working branch. If further changes need to be made, change them **on the same branch** and submit a new PR.





### Branch naming conventions

Work branches on the **main repo** are expected to follow this branch format:

```
<type>[/<page>][/<WEB-###>]/<objective>
```
* **type** - The type of work being done. See below for types.
* **page** - Used when the work  (e.g. `dispatch`, `paperwork`, `blog`, etc.)
* **WEB-###** - Used when the working branch was created to satisfy a ticket on [JIRA][jira]. This is required if there is an associated ticket.
* **objective** - a simple and breif descriptor of the work being done. words should be hyphen-delimited. e.g. `fix-paperwork`, `redesign-profiles`, `add-avatars`





### Commit conventions

Generally squeaking, all commits should follow this pattern:
```
<scope>[(<component>)]: <subject>

[body]

[footer]
```
* **type** - The type of work done in the commit. See below for types.
* **component** - Should follow these rules:
    * If the file is a react component (in the Components directory), no suffix is needed. Just use the file name.
      * CSS modules don't require
    * If the file is a helper file (in the helpers directory), just simply using `helpers` as the component will suffice.
    * If the file is documentation, no suffix is needed, however docs should **ALWAYS** have a commit type of `docs`.
    * All other files should generally follow the format of `filename-<best-describing-parentdir>` IE: `rescue-actions`, `index-page`, or `badge-scss`.
    * Remain as consistent in naming as possible. Use git history as precedence for the component name given to a file.
* **subject** - should quickly summarize changes made. If there are multiple changes, multiline commit messages are allowed to fully summarize changes made.
* **body** - The body can include any additional details which might be relevent to the commit. If your commit *must* contain multiple changes which are not covered by the subject, this would be the place to list them. This should be avoided, however.
* **footer** - The footer should first contain issue references (e.g. `Fixes WEB-100`, `Issue WEB-200`), and then any additional notes.
    *  If the working branch has a issue reference in it's name, then commit references are not required.
    * Notes should be separated from issue references with a blank line and then prefixed with the word `NOTE: `.

If in doubt about component naming, try to dive into the commit history for the file in question. Ultimately ask if you're still confused. Use your best judgement, but prefer consistency over enforcing the rules set by this document. the point of these rules is to make searching through commits easier, and consistency helps the most.

Commits should be as samll as possible, with exceptions for large sweeping changes required by lint rule changes, package updates, etc.

If the commit **must** make changes to two or more **completely unrelated** files, the component name and parentheses are not required.


### Commit/branch types
* `feat` - A new **user-facing** feature.
* `fix` -  A bug fix.
* `refactor` - A change in existing code that does not affect **user-facing** behavior.
* `docs` - A change in project documentation.
* `style` - A `refactor` which **only** fixes lint issues.
* `revert` - Reverts a previous commit. See below for more details on formatting a revert commit.
* `chore` - Maintenance tasks such as updating dependencies and project configs.

There is also 1 additional type allowed for branches **only**

* `experiment` - A new feature idea or major structural change which has a questionable outcome.

### Reverting a commit

Revert commits are a bit special. They should follow the format:

```
revert[(<original_component>)]: <original_subject>

<original_commit_hash>

<rationale>
```

* **original_component** - Component of the original commit. If none exists, this can be left out.
* **original_subject** - Subject of the original commit. Always required.
* **original_commit_hash** - Commit hash of the commit being reverted.
* **rationale** - All reverts must have a rationale behind it. This can be as simple as a few words or you can write an entire dissertation on it. Go nuts!


[fuelrats-tos]: https://fuelrats.com/terms-of-service
[all-contributors]: https://github.com/kentcdodds/all-contributors
[testsite]: https://dev.fuelrats.com/
[bugs]: https://jira.fuelrats.com/servicedesk/customer/portal/2/create/4
[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[jira]: https://jira.fuelrats.com/browse/WEB
[new-pr]: https://github.com/FuelRats/fuelrats.com/compare
[ops-email]: mailto:ops@fuelrats.com
[nvm-install]: https://github.com/nvm-sh/nvm#installing-and-updating
[node-install]: https://nodejs.org/en/
