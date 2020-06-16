# Extensions to install for VSCode

Here you will find a maintained list of VSCode extensions we use


## Required

These extensions are functionally required for development on fuelrats.com. The first provides syntax support for JSX and modern JS features, while the other two enforce lint rules we require comitted code to abide by.

* **[Babel JavaScript](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel)**
  * Provides syntax support for babel-enabled projects. Required for React/JSX projects.
* **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**
  * Adds static linting for javascript. We have our own ESLint configuration which is enforced on fuelrats.com.
* **[Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)**
  * Adds static linting for CSS/SCSS. We have our own Stylelint configuration as well, which is also enforced on fuelrats.com.




## Recommended

While you could write effective code with just the extensions above, having these installed will give you extra tools that we see as essential to developing in our JS projects.

* **[Blueprint](https://marketplace.visualstudio.com/items?itemName=teamchilla.blueprint)**
  * Advanced templates for new files and directories. We use them to make quick work of creating new component directories.
* **[Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)**
  * While VSCode has it's own path completions, it does not have the same level of control this extension has. Along with some performance benefit, this extension also has support for the path aliases, which we use in fuelrats.com code.
* **[DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)**
  * `.env` file syntax support. We use dotenv files for development environment setup.





## Optional

These are completely optional, but useful, tools that just provide extra benefit.



* **[Microsoft Intellicode](https://marketplace.visualstudio.com/items?itemName=visualstudioexptteam.vscodeintellicode)**
  * AI-assisted development.
* **[PropTypes Intellisense](https://marketplace.visualstudio.com/items?itemName=ofhumanbondage.react-proptypes-intellisense)**
  * Provides suggestions for component props based on PropType definitions.
* **[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)**
  * Other editors wish they had GitLens! Git integration on steroids. Provides a lot of useful git tools right within VSCode.
* **[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)**
  * Git timeline graph in VSCode. Just in case Gitlens isn't enough. With this VSCode becomes as much a Git client as it is an editor.
* **[Inline Parameters](https://marketplace.visualstudio.com/items?itemName=liamhammett.inline-parameters)**
  * JetBrains' Inline parameter feature, now in VSCode.
* **[Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)**
  * See the package size of each import in your editor.
* **[Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)**
  * Get NPM version information in your package.json
* **[Todo Tree](https://marketplace.visualstudio.com/items?itemName=gruntfuggly.todo-tree)**
  * Highlight and list all TODOs, FIXMEs, etc in a project. We do not allow TODOs to be submitted to develop, so if you make any this extension is great for tracking them down.




## Fun things

These are just some funs things some of us use.

* **[Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)**
  * POWAHHHHHHHHHHHHHH
* **[Code Capture](https://github.com/UncleClapton/code-capture)**
  * [@UncleClapton](https://github.com/UncleClapton)'s fork of [Polacode](https://marketplace.visualstudio.com/items?itemName=pnp.polacode), a screenshot extension.
