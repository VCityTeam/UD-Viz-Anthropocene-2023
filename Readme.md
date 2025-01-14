# UD-Viz : Urban Data Vizualisation

[![CodeQL](https://github.com/VCityTeam/UD-Viz/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VCityTeam/UD-Viz/actions/workflows/codeql-analysis.yml)
[![CI status](https://travis-ci.com/VCityTeam/UD-Viz.svg?branch=master)](https://app.travis-ci.com/github/VCityTeam/UD-Viz)
[![Documentation Status](https://readthedocs.org/projects/ansicolortags/badge/?version=latest)](http://vcityteam.github.io/UD-Viz/html/index.html)

UD-Viz is a 3-package JavaScript framework for creating web applications for visualizing and interacting with geospatial 3D urban data. Code is [open source](https://en.wikipedia.org/wiki/Open_source?useskin=vector) on licence LGPL 2.1 ([LICENSE.md](./LICENSE.md)).

> [Online demos](https://projet.liris.cnrs.fr/vcity/demos/)

**UD-Viz Packages:**

- [Shared](./packages/shared)
- [Browser](./packages/browser)
- [Node](./packages/node)

**Index**

- [UD-Viz : Urban Data Vizualisation](#ud-viz--urban-data-vizualisation)
  - [Directory Hierarchy](#directory-hierarchy)
  - [Getting Started](#getting-started)
    - [Installing node/npm](#installing-nodenpm)
    - [Installing the UD-Viz framework per se](#installing-the-ud-viz-framework-per-se)
    - [Run an example urban data web application](#run-an-example-urban-data-web-application)
    - [Documentation](#documentation)
  - [Developers](#developers)
    - [Pre-requisites](#pre-requisites)
    - [Environment Tips](#environment-tips)
      - [IDE](#ide)
        - [VisualStudio Code](#visualstudio-code)
      - [OS](#os)
        - [Windows](#windows)
    - [Npm Scripts](#npm-scripts)
    - [Debugging the examples](#debugging-the-examples)
    - [Continuous Integration (Travis CI)](#continuous-integration-travis-ci)
    - [Contributing](#contributing)
    - [Publishing](#publishing)

### Directory Hierarchy

```
UD-Viz (repo)
├── bin                       # Global NodeJS development and deployment
├── docs                      # Developer and User documentation
├── packages                  # Packages folder
|    ├── browser              # UD-Viz Browser-side framework
|    ├── shared               # UD-Viz shared Browser+Node framework
|    ├── node                 # UD-Viz Node-side framework
├── .eslintrc.js              # Linting rules and configuration
├── .gitignore                # Files/folders ignored by Git
├── .prettierrc               # Formatting rules
├── travis.yml                # Continuous integration entrypoint
├── favicon.ico               # Examples landing page icon
├── index.html                # Examples landing page entrypoint
├── package-lock.json         # Latest npm package installation file
├── package.json              # Global npm project description
├── Readme.md                 # It's a me, Mario!
├── style.css                 # Examples landing page style
```

## Getting Started

### Installing node/npm

For the node/npm installation instructions refer [here](https://github.com/VCityTeam/UD-SV/blob/master/Tools/ToolNpm.md)

UD-Viz has been reported to work with versions:

- node version 16.X
- npm version: 8.X

### Installing the UD-Viz framework per se

Clone the UD-Viz repository and install requirements with npm

```bash
git clone https://github.com/VCityTeam/UD-Viz.git
cd UD-Viz
npm install # resolve dependencies based on the package.json (and package-lock.json if it exists)
npm run link-local # use the local code instead of the modules published on npm
```

### Run an example urban data web application

To quickly build and locally host the examples landing page which links to several [UD-Viz example applications](./packages/browser/examples/).

```bash
npm run start
```

After running go to [localhost:8000](http://localhost:8000).

### Documentation

[Online documentation](https://vcityteam.github.io/UD-Viz/html/index.html)

Refer to this [Readme](./docs/Readme.md) to re-generate it and for more information.

## Developers

### Pre-requisites

Developing UD-Viz applications requires knowledge about :

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/javascript)
- [node.js](https://en.wikipedia.org/wiki/Node.js)
- [npm](<https://en.wikipedia.org/wiki/Npm_(software)>)
- [three.js](https://threejs.org/)
- [iTowns](http://www.itowns-project.org)

### Environment Tips

#### IDE

> VSCode is recommended.

##### VisualStudio Code

When using [Visual Studio Code](https://code.visualstudio.com/), you can install the following extentions to make your life easier:

- [eslint](https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code) - allows you e.g. to automatically fix the coding style e.g. [when saving a file](https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code).
- [Prettier](https://prettier.io/) - JS, JSON, CSS, and HTML formatter.
- [Mintlify](https://marketplace.visualstudio.com/items?itemName=mintlify.document) - AI-powered documentation generator. (may require rewriting by a human)

#### OS

##### Windows

As configured, the coding style requires a Linux style newline characters which might be overwritten in Windows environments
(both by `git` and/or your editor) to become `CRLF`. When such changes happen eslint will warn about "incorrect" newline characters
(which can always be fixed with `npm run eslint-fix` but this process quickly gets painful).
In order to avoid such difficulties, the [recommended pratice](https://stackoverflow.com/questions/1967370/git-replacing-lf-with-crlf)
consists in

1.  setting git's `core.autocrlf` to `false` (e.g. with `git config --global core.autocrlf false`)
2.  configure your editor/IDE to use Unix-style endings

### Npm Scripts

For **Windows** users:

> In order to use scripts that launch a shell script with Powershell: `npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"`

| Script                   | Description                                                                                                                                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run clean`          | Remove files and folders generated by `npm install` and the `npm run build-*` script such as `./node_modules`, `package-lock.json`, and `./dist`                                                                                                                      |
| `npm run reset`          | Reinstalls npm dependencies. This script runs `npm run clean` and `npm install` command                                                                                                                                                                               |
| `npm run link-local`     | Create local aliases to packages (_browser_, _shared_ and _node_ ) to avoid using relative paths in the package.json. See [link documentation](https://docs.npmjs.com/cli/v6/commands/npm-link) for more information. To delete these aliases you can run `npm prune` |
| `npm run build-shared`   | Call the build command of the [shared package](./packages/shared/Readme.md#npmscripttodo)                                                                                                                                                                             |
| `npm run build-browser`  | Call the build command of the [browser package](./packages/browser/Readme.md#npmscripttodo)                                                                                                                                                                           |
| `npm run build-node`     | Call the build command of the [node package](./packages/node/Readme.md#npmscripttodo)                                                                                                                                                                                 |
| `npm run debug-examples` | Launch a watcher and server for debugging the examples. See [here](#debugging-the-examples) for more information                                                                                                                                                      |
| `npm run eslint`         | Run the linter. See [here](#coding-style-linter) for more information                                                                                                                                                                                                 |
| `npm run eslint-quiet`   | Run the linter without displaying warnings, only errors                                                                                                                                                                                                               |
| `npm run eslint-fix`     | Run the linter and attempt to fix errors and warning automatically                                                                                                                                                                                                    |
| `npm run test`           | Build the 3 packages and tests shared, browser scripts and examples html. Uses [this test script](./bin/test.js)                                                                                                                                                      |
| `npm run assert-code`    | Run `npm run eslint` and `npm run test`. Also ran by CI. See [here](#continuous-integration-travis-ci) for more information                                                                                                                                           |
| `npm run pre-publish`    | Change version in all package.json ( eg `npm run pre-publish x.x.x` ). See [this script](./bin/prePublish.js)                                                                                                                                                         |
| `npm run docs-shared`    | Generate the [JSDOC shared package documentation](./docs/jsdocConfig/jsdoc.shared.json)                                                                                                                                                                               |
| `npm run docs-browser`   | Generate the [JSDOC browser package documentation](./docs/jsdocConfig/jsdoc.browser.json)                                                                                                                                                                             |
| `npm run docs-node`      | Generate the [JSDOC node package documentation](./docs/jsdocConfig/jsdoc.node.json)                                                                                                                                                                                   |
| `npm run docs-home`      | Generate the [JSDOC documentation landing page](./docs/jsdocConfig/jsdoc.home.json)                                                                                                                                                                                   |
| `npm run docs`           | Run `npm run docs-shared`, `npm run docs-browser`, `npm run docs-node`, and `npm run docs-home`                                                                                                                                                                       |
| `npm run dev-docs`       | Launch a watcher for generating and debugging the documentation. See [here](./docs/Readme.md) for more information                                                                                                                                                    |
| `npm run host`           | host the bundle with [an express server](./bin/host.js). <br>http://locahost:8000/                                                                                                                                                                                    |
| `npm run start`          | Run `npm run build-browser` and `npm run host`                                                                                                                                                                                                                        |

### Debugging the examples

The browser package contains several "example" applications that showcase different UD-Viz components and serve as templates for creating demos with UD-Viz.

```bash
npm run debug-examples
```

It run [debugExamples.js](./bin/debugExamples.js):

- Run an [ExpressAppWrapper](./packages/node/src/ExpressAppWrapper.js)
- Run a watched routine [buildDebugBrowser.js](./bin/buildDebugBrowser.js) with [nodemon](https://www.npmjs.com/package/nodemon).

### Continuous Integration (Travis CI)

Each time origin/master branch is impacted by changes, Travis CI is triggered. It does a set of jobs describe in [travis.yml](./.travis.yml).

Jobs list :

- `npm run assert-code`: Run linter, build bundles and run tests
- `npm audit --audit-level=moderate`: Npm native command ([npm-audit](https://docs.npmjs.com/cli/v6/commands/npm-audit)) which check packages dependencies vulnerabilities.
- `remark -u validate-links .`: Command of the package [remark-validate-links](https://www.npmjs.com/package/remark-validate-links) which check dead link in markdown.

### Contributing

For information on the accepted coding style, submitting Issues, and submitting Pull Requests see [Contributing.md](./docs/static/Devel/Contributing.md)

### Publishing

For creating a new release see [ReleasePublish.md](./docs/static/Devel/ReleasePublish.md)
