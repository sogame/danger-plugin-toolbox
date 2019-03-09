# Danger Plugin Toolbox

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- The validation [`cssBackpackVariables`](docs/validations.md#cssbackpackvariables) now also checks if `$bpk-one-pixel-rem` is used. This can hide the usage of `px` units.

## [1.4.0] - 2018-11-25

### Added

- Add support for TypeScript files in `jsConsoleCommands`, `jsLocalEslintChange` and `jsTestShortcuts`.

## [1.3.1] - 2018-11-13

### Fixed

- Fix messages in `commonFileContains` validation.

## [1.3.0] - 2018-11-13

### Added

- New validation [`commonFileWarnings`](docs/validations.md#commonfilewarnings) to list all file lines containing the word `warning` (useful to surface linting/test warnings).
- New validation [`commonFileContains`](docs/validations.md#commonfilecontains) to make sure the file contents match a regex.

## [1.2.0] - 2018-10-31

### Added

- New utility [`linkToTargetRepo`](docs/utilities.md#linktotargetrepo) to generate links to files in the target repository.
- New utility [`linkToSourceRepo`](docs/utilities.md#linktosourcerepo) to generate links to files in the source repository.
- New utility [`targetRepoUrl`](docs/utilities.md#targetrepourl) containing the target repository url.
- New utility [`sourceRepoUrl`](docs/utilities.md#sourcerepourl) containing the source repository url.

## [1.1.0] - 2018-10-29

### Added

- New validation [`commonCommitMessage`](docs/validations.md#commoncommitmessage) to make sure all commit messages match a regex (like ensuring a ticked id is added to all commit messages).

## [1.0.0] - 2018-10-23

### Added

- Initial release.
