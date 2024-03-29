# danger-plugin-toolbox

> Danger Plugin Toolbox is a [Danger JS](https://danger.systems/js/) plugin containing a set of common validations and utilities, build to make it easy to start using Danger JS.

[![build](https://github.com/sogame/danger-plugin-toolbox/actions/workflows/ci.yml/badge.svg)](https://github.com/sogame/danger-plugin-toolbox/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/danger-plugin-toolbox.svg)](https://badge.fury.io/js/danger-plugin-toolbox)

## Installation

```sh
npm install danger-plugin-toolbox --save-dev
```

## Usage

Edit your `dangerfile.js` to import the required validations and utilities, and build the contents using those:

```js
const { warn } = require('danger');
const {
  jsLockfile,
  commonValidJson,
  inCommitGrep,
} = require('danger-plugin-toolbox');

jsLockfile();

commonValidJson();

if (inCommitGrep(/.+\.log$/)) {
  warn('Do not commit log files');
}
```

## Validations and utilities

Find here the documentation of all **validations** and **utilities** provided by Danger Plugin Toolbox:

- [Validations](docs/validations.md)
- [Utilities](docs/utilities.md)

## Changelog

See the release history in [CHANGELOG.md](CHANGELOG.md).

## Contributing

To contribute please see [CONTRIBUTING.md](CONTRIBUTING.md).
