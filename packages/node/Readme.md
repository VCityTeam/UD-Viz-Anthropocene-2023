# @ud-viz/node

[![NPM package version](https://badgen.net/npm/v/@ud-viz/node)](https://npmjs.com/package/@ud-viz/node)

[@ud-viz/node](https://npmjs.com/package/@ud-viz/node) is a npm package including dev tools plus a dedicated [@ud-viz/browser](https://npmjs.com/package/@ud-viz/browser) back-end service based on the [@ud-viz/shared](https://npmjs.com/package/@ud-viz/shared) package.

- [@ud-viz/node](#ud-viznode)
    - [Directory Hierarchy](#directory-hierarchy)
  - [Getting started](#getting-started)
  - [Developers](#developers)
    - [Npm scripts](#npm-scripts)
    - [Debugging](#debugging)

### Directory Hierarchy

```
UD-Viz/packages/node
├── src                             # JS files composing the package
|    ├── Debug.js                   # Debugging routine for @ud-viz/* packages
|    ├── ExpressAppWrapper.js       # Express app wrapper for @ud-viz/browser (dedicated back-end)
|    ├── index.js                   # API description (webpack entry point)
|    ├── Test.js                    # Module for testing @ud-viz/* packages.
├── package.json                    # Global npm project description
├── Readme.md                       # It's a me, Mario!
├── webpack.config.js               # Config of bundle creation
```

## Getting started

See [here](https://github.com/VCityTeam/UD-Viz/blob/master/Readme.md#getting-started).

## Developers

For pre-requisites see [here](https://github.com/VCityTeam/UD-Viz/blob/master/Readme.md#pre-requisites).

### Npm scripts

| Script          | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `npm run build` | Create a [webpack](https://webpack.js.org/) bundle, this command is just here for test purpose |


### Debugging

To debug the [ExpressAppWrapper](./src/ExpressAppWrapper.js) back-end see [here](../../Readme.md#debugging-the-examples)
