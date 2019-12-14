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

1. Fork and clone the repo
1. Setup environment variables (detailed in ["Some things you'll need"](#some-things-youll-need))
1. `$ yarn install` to install dependencies
1. `$ yarn run dev` to start up the dev server
1. Create a branch for your PR

> NPM is no longer supported due to exotic dependency versioning, which only works with yarn.

### Some things you'll need

By default, the website doesn't know much about connecting to the Fuel Rats API or to the Fuel Rats Wordpress. To remedy this, you'll need to set some environment variables. To make this as easy as possible, There is a enviornment variable template file named `.env.template` located in the root directory. Copy this file and rename it to `.env`, then fill in the appropriate values. Unsure of what values to set? Contact a project maintainer!

> Tip: Keep your `develop` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
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

## Add yourself as a contributor

This project follows the [all contributors][all-contributors] specification. To add yourself to the table of contributors on the README.md, please use the automated script as part of your PR:

```console
$ yarn run add-contributor
```

Follow the prompt. If you've already added yourself to the list and are making a new type of contribution, you can run it again and select the added contribution type.

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
type/WEB-###/objective
```
* **type** - The type of work being done. See below for types.
* **WEB-###** - Used when the working branch was created to satisfy a ticket on [JIRA][jira]. This should only be included if there is an associated ticket.
* **objective** - a simple and breif descriptor of the work being done. words should be hyphen-delimited. e.g. `fix-paperwork`, `redesign-profiles`, `add-avatars`





### Commit conventions

We use an interpretation of the angular commit conventions in this project. Generally squeaking, all commits should follow this pattern:
```
type(component): commit message
```
* **type** - The type of work done in the commit. See below for types.
* **component** - Should follow these rules:
    * If the file is a react component (in the Components directory), no suffix is needed. Just use the file name.
    * If the file is a helper file (in the helpers directory), just simply using `helpers` as the component will suffice.
    * If the file is documentation, no suffix is needed, however docs should **ALWAYS** have a commit type of `docs`.
    * All other files should generally follow the format of `filename-<best-describing-parentdir>` IE: `rescue-actions`, `index-page`, or `badge-scss`.
    * Remain as consistent in naming as possible. Use git history as precedence for the component name given to a file.
* **commit message** - should quickly summarize changes made. If there are multiple changes, multiline commit messages are allowed to fully summarize changes made.

If in doubt about component naming, try to dive into the commit history for the file in question. Ultimately ask if you're still confused. Use your best judgement, but prefer consistency over enforcing the rules set by this document. the point of these rules is to make searching through commits easier, and consistency helps the most.

Commits should be as samll as possible, with exceptions for large sweeping changes required by lint rule changes, package updates, etc.

If the commit **must** make changes to two or more **completely unrelated** files, the component name and parentheses are not required.


### Commit types
* `feat` - New feature.
* `fix` - Bug fix.
* `refactor` - A change in behavior of existing code.
* `docs` - A change in project documentation.
* `style` - Fixes which **only** fix code style and not behavior.
* `chore` - Maintenance tasks such as updating dependencies.

There is also 1 additional type allowed for branches **only**

* `experiment` - A new feature idea or major structural change which has a questionable outcome.

[fuelrats-tos]: https://fuelrats.com/terms-of-service
[all-contributors]: https://github.com/kentcdodds/all-contributors
[testsite]: https://dev.fuelrats.com/
[bugs]: https://jira.fuelrats.com/servicedesk/customer/portal/2/create/4
[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[jira]: https://jira.fuelrats.com/browse/WEB
[new-pr]: https://github.com/FuelRats/fuelrats.com/compare
[ops-email]: mailto:ops@fuelrats.com
