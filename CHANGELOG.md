# Danger Plugin Toolbox

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

**Nothing yet**

## [1.10.0] - 2019-5-3

### Fixed

- Improved [`commonFileWarnings`](docs/validations.md#commonfilewarnings) validation.

### Added

- Allow customising the message in [`commonPrDescription`](docs/validations.md#commonprdescription).
- Allow customising the message in [`commonPrDescriptionContribution`](docs/validations.md#commonprdescriptioncontribution).

## [1.9.0] - 2019-5-2

### Added

- Allow customising the message in [`commonFileWarnings`](docs/validations.md#commonfilewarnings).

## [1.8.0] - 2019-4-23

### Added

- New validation [`reactRecommendClassProperties`](docs/validations.md#reactRecommendClassProperties) to recommend using class properties to define `state` and PropTypes in React components.

## [1.7.0] - 2019-4-17

### Added

- New validation [`jsRecommendAsyncAwait`](docs/validations.md#jsRecommendAsyncAwait) to recommend using Async/Await instead of Promises.

### Changed

- Change the message `COMMON_COMMIT_MESSAGE_JIRA_MSG` (this is the suggested message to use when commits do not include a Jira ticket in [`commonCommitMessage`](docs/validations.md#commoncommitmessage)).

## [1.6.0] - 2019-3-26

### Added

- The regex to check for a Jira ticket in a commit message now allows not using braces around the ticket id (so `ABC-123 My commit message` will now work). The regex is also case insensitive now.

## [1.5.1] - 2019-3-14

### Fixed

- Improve `jsTestShortcuts` check (make sure it's a function call).

## [1.5.0] - 2019-3-14

### Added

- The validation [`cssBackpackVariables`](docs/validations.md#cssbackpackvariables) now also checks if `$bpk-one-pixel-rem` is used. This can hide the usage of `px` units.
- Allow `logType` in rules with multiple log types. This will be used as default value for any log type not defined explicitly.

### Fixed

- Improve `jsTestShortcuts` check (make sure it's a function call).

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
