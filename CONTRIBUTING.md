# How to contribute

This project operates under a _forking model_. In order to contribute, please:

1. Fork the repository.
2. Create a new branch.
3. Make your changes (adding tests).
4. Add an entry in [CHANGELOG.md](CHANGELOG.md) (under the "Unreleased" section).
5. Submit a pull request (make sure to add a description explaining the changes).

## Development

Run `npm ci` to install the dependencies.

A pre-commit hook will lint the code and automatically fix some issues (and added to the commit). Linter can be executed manually running `npm run lint`.

To test the code, run `npm test`. A pre-push hook will run the tests before the code is pushed.

- The command `npm run test:watch` runs the tests in watch mode (execution is triggered automatically when editing a test file).
- The command `npm run test:coverage` generates the coverage report (in the `coverage/` folder).
