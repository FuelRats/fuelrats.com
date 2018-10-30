# Contributing

You want to contribute to the project? Awesome!

## Things to know

This project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [ops@fuelrats.com][ops-email]

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
2. `$ yarn install` to install dependencies
3. `$ yarn run dev` to start up the dev server
4. Create a branch for your PR

### Some things you'll need

By default, the website doesn't know much about connecting to the Fuel Rats API or to the Fuel Rats Wordpress. To remedy this, you'll need to set some environment variables:

| Name                      | Default                 | Purpose                                                                                                        |
|---------------------------|-------------------------|----------------------------------------------------------------------------------------------------------------|
| `FRDC_API_KEY`            | REQUIRED                | This is your OAuth application's client key or ID                                                              |
| `FRDC_API_SECRET`         | REQUIRED                | This is your OAuth application's client secret                                                                 |
| `FRDC_API_URL`            | `http://localhost:8080` | This is the URL at which the **SERVER** can reach the Fuel Rats API                                            |
| `FRDC_PUBLIC_URL`         | `http://localhost:3000` | This is the URL where the website is publically available. If in development, use localhost, or leave blank    |
| `PORT`                    | `3000`                  | This is the port to run the application at                                                                     |

You can define any or all of these variables in the same command you use to start the server:

```
$ FRDC_API_URL="https://dev.api.fuelrats.com" PORT=3000 yarn run dev
```

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com//FuelRats/fuelrats.com.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream,"
> Then fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`.
> Then you can make all of your pull request branches based on this `master`
> branch. Whenever you want to update your version of `master`, do a regular
> `git pull`.

## Add yourself as a contributor

This project follows the [all contributors][all-contributors] specification. To add yourself to the table of contributors on the README.md, please use the automated script as part of your PR:

```console
yarn run add-contributor
```

Follow the prompt. If you've already added yourself to the list and are making a new type of contribution, you can run it again and select the added contribution type.

## Contributing as an Organization member

Below are steps which must be followed by Fuel Rats org members. External collaborators only have to follow the above guidelines.

### Steps for development

1. Branch from `develop` using the formatting rules below.
2. Do the work required to satisfy the Ticket or objective. If work unrelated to the objective needs to be done, make a separate branch.
3. Submit PR to merge back into `develop`.
    * Any change which would affect current development should be documented in the description.
    * PRs for a ticket should be tagged in the title with the ticket. IE: `[WEB-##] Fix bug`
    * Assign the PR to yourself.
    * The PR should be labeled with the label most fitting to the type of work. If the PR is a bugfix which must be merged to fix a major problem, it should be labeled `Urgent`.
    * When the PR is ready to be merged, A review should be requested from the `FuelRats/web` team.
4. Once the PR is approved, it is the responsibility of the **assignee** to merge the changes to the branch.
5. After the build has been deployed, test the changes on the [staging preview website][testsite].
6. Once the change is confirmed working, delete the working branch. If further changes need to be made, change them **on the same branch** and submit a new PR.



### Branch name formatting

Work branches on the **main repo** are expected to follow this branch format:

```
(WEB-##/)<type>/<objective>
```
* **WEB-##** - Used when the working branch was created to satisfy a ticket on [JIRA][jira]. This directory is **mandatory** if there is an associated ticket.
* **<type>** - The type of work being done. See below for types.
* **<objective>** - a simple and breif descriptor of the work being done. words should be hyphen-delimited. e.g. `fix-paperwork`, `redesign-profiles`, `add-avatars`

Types:
* `feat` - New feature
* `fix` - Bug fix
* `refactor` - A change in behavior of existing code
* `docs` - A change in project documentation
* `style` - Fixes which **only** fix code style and not behavior
* `chore` - Maintenance tasks such as updating dependencies

(look familiar to you? Yes, we loosely follow angular commit conventions :D)


[all-contributors]: https://github.com/kentcdodds/all-contributors
[testsite]: https://dev.fuelrats.com/
[bugs]: https://jira.fuelrats.com/servicedesk/customer/portal/2/create/4
[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[jira]: https://jira.fuelrats.com/browse/WEB
[new-pr]: https://github.com/FuelRats/fuelrats.com/compare
[ops-email]: mailto:ops@fuelrats.com
