# Contributing

You want to contribute to the project? Awesome!

## Things to know

This project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [ops@fuelrats.com][ops-email]

**Working on your first Pull Request?**
[How to Contribute to an Open Source Project on GitHub][egghead]

## How do

* Project setup?
  [We've got you covered!][#project-setup]

* Found a bug?
  [Let us know!][bugs]

* Patched a bug?
  [Make a PR!][new-pr]

* Adding a new feature?
  Please, *please*, ***please*** get some feedback from the tech rats and/or the ops team before you write any code. Don't waste your time building a feature that's already been struck down.

## Project setup

1. Fork and clone the repo
2. `$ npm install` to install dependencies
3. `$ npm run dev` to start up the dev server
4. Create a branch for your PR

### Some things you'll need

By default, the website doesn't know much about connecting to the Fuel Rats API or to the Fuel Rats Wordpress. To remedy this, you'll need to set some environment variables:

| Name                      | Purpose                                                                                                        |
|---------------------------|----------------------------------------------------------------------------------------------------------------|
| `FRDC_API_KEY`            | This is your OAuth application's client key or ID                                                              |
| `FRDC_API_SECRET`         | This is your OAuth application's client secret                                                                 |
| `FRDC_API_URL`            | This is the URL at which you can reach the Fuel Rats API                                                       |
| `FRDC_WORDPRESS_USERNAME` | This is your Wordpress username                                                                                |
| `FRDC_WORDPRESS_PASSWORD` | This is your Wordpress application password (this **is** different from your normal Wordpress account password |
| `PORT`                    | This is the port to run the application at                                                                     |

You can define any or all of these variables in the same command you use to start the server:

```
$ FRDC_API_URL="https://dev.api.fuelrats.com" PORT=8080 npm run dev
```

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/kentcdodds/nps.git
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
npm run add-contributor
```

Follow the prompt. If you've already added yourself to the list and are making a new type of contribution, you can run it again and select the added contribution type.

[all-contributors]: https://github.com/kentcdodds/all-contributors
[bugs]: https://jira.fuelrats.com/servicedesk/customer/portal/2/create/4
[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[new-pr]: https://github.com/FuelRats/fuelrats.com/compare
[ops-email]: mailto:ops@fuelrats.com
