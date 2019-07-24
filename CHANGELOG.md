# Danger Plugin Toolbox

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

ddd console www

## [Unreleased]

**Nothing yet**

## [1.15.0] - 2019-7-24

### Added

- New validation [`commonAddedLinesContains`](docs/validations.md#commonaddedlinescontains) to check if the provided regex matches any added line in the files.

### Changed

- Change the regular expression `COMMON_COMMIT_MESSAGE_JIRA_REGEX` to allow a colon after the Jira ticket (used in [`commonCommitMessage`](docs/validations.md#commoncommitmessage)).

## [1.14.0] - 2019-6-26

### Added

- Allow using `markdown` as log function in [`commonContribution`](docs/validations.md#commoncontribution) validation.

## [1.13.1] - 2019-6-12

### Fixed

- Fix in [`committedFilesGrep`](docs/utilities.md#committedfilesgrep) and [`inCommitGrep`](docs/utilities.md#incommitgrep) to avoid crashing when the list of committed files contains a `null` value.

## [1.13.0] - 2019-5-18

### Changed

- Improved [`jsLockfile`](docs/validations.md#jslockfile) validation: now it checks that `dependencies` or `devDependencies` have changed in `package.json` (it used to only check if `package.json` was changed).

### Added

- New utility [`fileAddedLineNumbers`](docs/utilities.md#fileaddedlinenumbers) to get an array with the line number of all added lines.
- New validation [`reactBackpackCssModules`](docs/validations.md#reactbackpackcssmodules) to recommend using [Backpack's `cssModules` utility](https://github.com/Skyscanner/backpack/tree/master/packages/bpk-react-utils#cssmodulesjs) in React components.

## [1.12.0] - 2019-5-10

### Added

- Added option to add the comments inline in the PR's for [`cssBackpackVariables`](docs/validations.md#cssbackpackvariables), [`cssLocalStylelintChange`](docs/validations.md#csslocalstylelintchange), [`cssRemOverEm`](docs/validations.md#cssremoverem), [`jsConsoleCommands`](docs/validations.md#jsconsolecommands), [`jsLocalEslintChange`](docs/validations.md#jslocaleslintchange), [`jsRecommendAsyncAwait`](docs/validations.md#jsrecommendasyncawait) and [`jsTestShortcuts`](docs/validations.md#jstestshortcuts).

## [1.11.0] - 2019-5-7

### Fixed

- Fixed link to contribution guide in [`commonContributingGuide`](docs/validations.md#commoncontributingguide).

### Added

- New utility [`structuredFileAddedLines`](docs/utilities.md#structuredfileaddedlines) to get an object with the added line numbers and its content.
- New utility [`structuredFileAddedLineMatches`](docs/utilities.md#structuredfileaddedlinematches) to get the list of line numbers of the added lines matching a pattern.

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

- New validation [`reactRecommendClassProperties`](docs/validations.md#reactrecommendclassproperties) to recommend using class properties to define `state` and PropTypes in React components.

## [1.7.0] - 2019-4-17

### Added

- New validation [`jsRecommendAsyncAwait`](docs/validations.md#jsrecommendasyncawait) to recommend using Async/Await instead of Promises.

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
