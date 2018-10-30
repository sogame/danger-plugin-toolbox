# Danger Plugin Toolbox

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
