# danger-plugin-toolbox

## Validations

Most of the validations add a warning message in the Danger comment when the check fails.
The message type (failure, warning, info) can be configured when using each validation.
Some validations can be configured to add the comments inline in the PR (instead of in the general comment that contains all messages).

### commonAddedLinesContains

Check if the provided regex matches any added line in the files.

This can be used to prevent some text being added (like debugging commands, banned words...).

##### Parameters

1. `filesRegex`: The regular expression matching the files to analyse.
1. `lineRegex`: The regular expression matching the line content to find.
1. `buildMessage`: The function to build the message string to display. This function gets the filename as parameter.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| inline   | bool                       | false         |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
commonAddedLinesContains(/\.(js|jsx)$/i, /console\.[a-z]+/, f => `The file "${f}" may contain console commands.`);
commonAddedLinesContains(/\.md$/i, /react native+/, () => 'Please, use "React Native" instead of "react native".' { inline: true });
commonAddedLinesContains(/\.(js|jsx)$/i, /console\.[a-z]+/, f => `The file "${f}" may contain console commands.`, { logType: 'fail' });
```

### commonChangelog

Make sure the changelog file has been updated.

##### Configuration

| Property      | Type                       | Default Value |
| ------------- | -------------------------- | ------------- |
| logType       | enum (warn, fail, message) | warn          |
| changelogFile | string                     | CHANGELOG.md  |

##### Usage

```
commonChangelog();
commonChangelog({ logType: 'fail' });
commonChangelog({ changelogFile: 'unreleased.md', logType: 'message' });
```

### commonCommitMessage

Make sure all commit messages match a regex.

`reverse` can be used to make sure no commit message matches a regex.
`ignoredAuthors` can be used to filter out commits authored by users that can be ignored (like bots).
`hideCommits` can be used to not show the commit messages that triggered the rule.

##### Parameters

1. `regex`: The regex used to match the strings.
1. `message`: The message to show when any commit does not match the regex.

##### Defined constants

- `COMMON_COMMIT_MESSAGE_JIRA_REGEX`: When using this regex, the validation will fail if any commit message does not start with a Jira ticket (like `FOO-123`) or the string `NO-JIRA`.
- `COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REGEX`: Like the previous one, but also allowing merge commits (like `Merge pull request #123 from sogame/danger-plugin-toolbox` or `Merge branch 'master' of sogame/danger-plugin-toolbox`).
- `COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX`: Like the previous one, but also allowing revert commits (like `Revert "My PR title"`).
- `COMMON_COMMIT_MESSAGE_JIRA_OR_COMMON_EXCEPTIONS_REGEX`: When using this regex, the validation will fail if any commit message does not start with a Jira ticket (like `FOO-123`), the string `NO-JIRA` or the most common exceptions (merge branch, merge pull request, revert or dependency bump).
- `COMMON_COMMIT_MESSAGE_NO_JIRA_REGEX`: When using this regex, the validation will fail if any commit message does not start with the string `NO-JIRA`.
- `COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REGEX`: Like the previous one, but also allowing merge commits (like `Merge pull request #123 from sogame/danger-plugin-toolbox` or `Merge branch 'master' of sogame/danger-plugin-toolbox`).
- `COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REVERT_REGEX`: Like the previous one, but also allowing revert commits (like `Revert "My PR title"`).
- `COMMON_COMMIT_MESSAGE_JIRA_MSG`: A sample message to use with `COMMON_COMMIT_MESSAGE_JIRA_REGEX`, `COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REGEX` or `COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX`.

##### Configuration

| Property       | Type                       | Default Value |
| -------------- | -------------------------- | ------------- |
| reverse        | bool                       | false         |
| ignoredAuthors | array (of strings)         | []            |
| hideCommits    | bool                       | false         |
| logType        | enum (warn, fail, message) | warn          |

##### Usage

```
commonCommitMessage(/foo/, 'Some commit message does not contain "foo".');
commonCommitMessage(/foo/, 'Some commit message does not contain "foo".', { ignoredAuthors: ['snyk-bot', 'dependabot']});
commonCommitMessage(/foo/, 'Some commit message contains "foo".', { reverse: true });
commonCommitMessage(COMMON_COMMIT_MESSAGE_JIRA_REGEX, COMMON_COMMIT_MESSAGE_JIRA_MSG);
commonCommitMessage(COMMON_COMMIT_MESSAGE_JIRA_REGEX, COMMON_COMMIT_MESSAGE_JIRA_MSG, { logType: 'fail', hideCommits: true });
```

### commonContributingGuide

Thank the author of [external contributions](utilities.md#externalpr) and link to the contributing guidelines.

##### Configuration

| Property         | Type   | Default Value   |
| ---------------- | ------ | --------------- |
| contributingFile | string | CONTRIBUTING.md |

##### Usage

```
commonContributingGuide();
commonContributingGuide({ contributingFile: 'contribute.md' });
```

### commonContribution

Thank the author of [external contributions](utilities.md#externalpr).

##### Configuration

| Property | Type                     | Default Value |
| -------- | ------------------------ | ------------- |
| msg      | string                   |               |
| logType  | enum (message, markdown) | message       |

##### Usage

```
commonContribution();
commonContribution({ msg: 'Many thanks for your collaboration!' });
commonContribution({ logType: 'markdown', msg: '**Many thanks for your collaboration!**' });
```

### commonFileContains

Make sure file contents match a regex.

`reverse` can be used to make sure file contents do not match a regex.
`notInCommit` can be used to run the validation even if the file has not been committed.

##### Parameters

1. `file`: The file to check.
1. `regex`: The regex used to match the file contents.

##### Configuration

| Property     | Type                                   | Default Value |
| ------------ | -------------------------------------- | ------------- |
| reverse      | bool                                   | false         |
| notInCommit  | bool                                   | false         |
| logType      | enum (warn, fail, message)             | warn          |
| buildMessage | func(filename, regex, reverse): string |               |

##### Usage

```
commonFileContains('changelog.md', /unreleased/mi);
commonFileContains('file.js', /^\s*var /mi, { reverse: true });
```

### commonFileExists

Make sure the files exist in the repo.

##### Parameters

1. `files`: The file or list of files (both string and array of strings are valid) to check.

##### Configuration

| Property     | Type                       | Default Value |
| ------------ | -------------------------- | ------------- |
| logType      | enum (warn, fail, message) | warn          |
| buildMessage | func(filename): string     |               |

##### Usage

```
commonFileExists('file.js');
commonFileExists(['file1.js', 'folder/file2.js']);
commonFileExists('file.js', { logType: 'fail' });
```

### commonFileWarnings

List file lines containing warnings (like "warning " or "warning:").

This can be used to surface warnings when running linters or tests: it only requires keeping the linter/test output in a log file with a command like `(set -o pipefail; npm run lint |& tee linter.log);`.
It will show a warning if the file does not exist.

`ignoreRegex` can be used to ignore the lines that match that regex.
`ignoreNonExistingFile` can be used to not show any warning if the file does not exist.

##### Parameters

1. `file`: The file to check (find warnings).

##### Configuration

| Property              | Type                       | Default Value |
| --------------------- | -------------------------- | ------------- |
| logType               | enum (warn, fail, message) | warn          |
| msg                   | string                     |               |
| ignoreRegex           | regex                      |               |
| ignoreNonExistingFile | bool                       | false         |

##### Usage

```
commonFileWarnings('linter.log');
commonFileWarnings('linter.log', { msg: 'There are the following linting errors:' });
commonFileWarnings('tests.log', { logType: 'fail' });
commonFileWarnings('tests.log', { ignoreRegex: /ignored text/ });
```

### commonPrDescription

Check there is a description in the pull request (unless the pull request is flagged as [trivial](utilities.md#istrivial)).

##### Configuration

| Property  | Type                       | Default Value |
| --------- | -------------------------- | ------------- |
| logType   | enum (warn, fail, message) | warn          |
| minLength | integer                    | 5             |
| msg       | string                     |               |

##### Usage

```
commonPrDescription();
commonPrDescription({ msg: 'Please add a description.' });
commonPrDescription({ logType: 'message' });
commonPrDescription({ minLength: 10, logType: 'fail' });
```

### commonPrDescriptionContribution

Check there is a description in [external contributions](utilities.md#externalpr) (unless the pull request is flagged as [trivial](utilities.md#istrivial)).

##### Configuration

| Property  | Type                       | Default Value |
| --------- | -------------------------- | ------------- |
| logType   | enum (warn, fail, message) | warn          |
| minLength | integer                    | 5             |
| msg       | string                     |               |

##### Usage

```
commonPrDescriptionContribution();
commonPrDescriptionContribution({ msg: 'Please add a description.' });
commonPrDescriptionContribution({ logType: 'message' });
commonPrDescriptionContribution({ minLength: 10, logType: 'fail' });
```

### commonRequireFilesInCodeowners

Check all added files have an owner defined in CODEOWNERS.

`pathsPattern` can be used to restrict the check the folders that match it.

##### Configuration

| Property       | Type                       | Default Value |
| -------------- | -------------------------- | ------------- |
| pathsPattern   | regex                      | /.\*/         |
| codeownersPath | string                     | CODEOWNERS    |
| logType        | enum (warn, fail, message) | warn          |

##### Usage

```
commonRequireFilesInCodeowners();
commonRequireFilesInCodeowners({ pathsPattern: 'modules/' });
commonRequireFilesInCodeowners({ codeownersPath: '.github/CODEOWNERS' });
commonRequireFilesInCodeowners({ logType: 'fail' });
```

### commonValidJson

Check JSON files are valid.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
commonValidJson();
commonValidJson({ logType: 'fail' });
```

### cssBackpackVariables

Recommend using [Backpack](https://backpack.github.io/) variables/spacings (or whole multiples of them) instead of creating new values. Also, checks if `$bpk-one-pixel-rem` is used, as this can hide the usage of `px` units.

##### Configuration

| Property                | Type                       | Default Value |
| ----------------------- | -------------------------- | ------------- |
| inline                  | bool                       | false         |
| logTypeNonBackpackUnits | enum (warn, fail, message) | warn          |
| logTypeOnePixelRem      | enum (warn, fail, message) | warn          |
| logType                 | enum (warn, fail, message) | warn          |

##### Usage

```
cssBackpackVariables();
cssBackpackVariables({ inline: true });
cssBackpackVariables({ logTypeNonBackpackUnits: 'fail', logTypeOnePixelRem: 'message' });
cssBackpackVariables({ logType: 'fail' }); // Set both log types to "fail"
```

### cssGlobalStylelintChange

Check if global stylelint configuration (`.stylelintrc`) or `.stylelintignore` have been modified.

##### Configuration

| Property               | Type                       | Default Value |
| ---------------------- | -------------------------- | ------------- |
| logTypeStylelintrc     | enum (warn, fail, message) | warn          |
| logTypeStylelintignore | enum (warn, fail, message) | warn          |
| logType                | enum (warn, fail, message) | warn          |
| path                   | string                     | ''            |

##### Usage

```
cssGlobalStylelintChange();
cssGlobalStylelintChange({ logTypeStylelintrc: 'fail', logTypeStylelintignore: 'message' });
cssGlobalStylelintChange({ logType: 'fail' }); // Set both log types to "fail"
cssGlobalStylelintChange({ path: 'another/folder/' });
```

### cssLocalStylelintChange

Check if stylelint has been disabled in the committed files (scss or css).

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| inline   | bool                       | false         |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
cssLocalStylelintChange();
cssLocalStylelintChange({ inline: true });
cssLocalStylelintChange({ logType: 'fail' });
```

### cssRemOverEm

Check if `em` are used instead of `rem` in the committed files (scss or css).

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| inline   | bool                       | false         |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
cssRemOverEm();
cssRemOverEm({ inline: true });
cssRemOverEm({ logType: 'fail' });
```

### droneEnsureSkipRelease

If there's a commit that does not contain the text `[skip release]`, show a message to make sure a new version is needed.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
droneEnsureSkipRelease();
droneEnsureSkipRelease({ logType: 'fail' });
```

### droneSkipCi

If all commits contain the text `[skip ci]`, show a warning to make sure running CI is not needed.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
droneSkipCi();
droneSkipCi({ logType: 'fail' });
```

### droneSkipRelease

If all commits contain the text `[skip release]`, show a warning to make sure a new version is not needed.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
droneSkipRelease();
droneSkipRelease({ logType: 'fail' });
```

### imageMinified

When uploading an image, make sure it's minified.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
imageMinified();
imageMinified({ logType: 'fail' });
```

### imageMinifiedJpg

When uploading a JPG, make sure it's minified.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
imageMinifiedJpg();
imageMinifiedJpg({ logType: 'fail' });
```

### imageMinifiedPng

When uploading a PNG, make sure it's minified.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
imageMinifiedPng();
imageMinifiedPng({ logType: 'fail' });
```

### imageMinifiedSvg

When uploading an SVG, make sure it's minified.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
imageMinifiedSvg();
imageMinifiedSvg({ logType: 'fail' });
```

### jsConsoleCommands

Check if there are console commands (logs/asserts/counts/times/profiles/...).

`ignorePathRegex` can be used to ignore the files/folders that match it.

##### Configuration

| Property        | Type                       | Default Value |
| --------------- | -------------------------- | ------------- |
| inline          | bool                       | false         |
| logType         | enum (warn, fail, message) | warn          |
| ignorePathRegex | regex                      |               |

##### Usage

```
jsConsoleCommands();
jsConsoleCommands({ inline: true });
jsConsoleCommands({ logType: 'fail' });
jsConsoleCommands({ ignorePathRegex: '/ignoredFolder/' });
```

### jsGlobalEslintChange

Check if global eslint configuration (`.eslintrc`) or `.eslintignore` have been modified.

##### Configuration

| Property            | Type                       | Default Value |
| ------------------- | -------------------------- | ------------- |
| logTypeEslintrc     | enum (warn, fail, message) | warn          |
| logTypeEslintignore | enum (warn, fail, message) | warn          |
| logType             | enum (warn, fail, message) | warn          |
| path                | string                     | ''            |

##### Usage

```
jsGlobalEslintChange();
jsGlobalEslintChange({ logTypeEslintrc: 'fail', logTypeEslintignore: 'message' });
jsGlobalEslintChange({ logType: 'fail' }); // Set both log types to "fail"
jsGlobalEslintChange({ path: 'another/folder/' });
```

### jsLocalEslintChange

Check if eslint has been disabled in the committed files.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| inline   | bool                       | false         |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
jsLocalEslintChange();
jsLocalEslintChange({ inline: true });
jsLocalEslintChange({ logType: 'fail' });
```

### jsLockfile

If dependencies change (changes in `package.json`), `package-lock.json` also must be updated.

##### Configuration

| Property           | Type                       | Default Value |
| ------------------ | -------------------------- | ------------- |
| logTypePackage     | enum (warn, fail, message) | warn          |
| logTypePackageLock | enum (warn, fail, message) | warn          |
| logType            | enum (warn, fail, message) | warn          |
| path               | string                     | ''            |

##### Usage

```
jsLockfile();
jsLockfile({ logTypePackage: 'fail', logTypePackageLock: 'message' });
jsLockfile({ logType: 'fail' }); // Set both log types to "fail"
jsLockfile({ path: 'another/folder/' });
```

### jsRecommendAsyncAwait

Check if Promises are being used, and recommend using Async/Await instead.

`ignoreTests` can be used to ignore test files (like `file.test.js`) and mocks (files inside a `__mocks__/` folder), so using Promises will be allowed in these files.

##### Configuration

| Property    | Type                       | Default Value |
| ----------- | -------------------------- | ------------- |
| ignoreTests | bool                       | false         |
| inline      | bool                       | false         |
| logType     | enum (warn, fail, message) | warn          |

##### Usage

```
jsRecommendAsyncAwait();
jsRecommendAsyncAwait({ inline: true });
jsRecommendAsyncAwait({ inline: true, ignoreTests: true });
jsRecommendAsyncAwait({ logType: 'fail' });
```

### jsOutOfSyncDeps

Check if `dependencies` and `devDependencies` in `package.json` and `package-lock.json` are in sync, and reports any mismatch between the expected version (`package.json`) and the installed one (`package-lock.json`).

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| path     | string                     | ''            |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
jsOutOfSyncDeps();
jsOutOfSyncDeps({ logType: 'fail' });
jsOutOfSyncDeps({ path: 'another/folder/' });
```

### jsTestShortcuts

Check if there are test shortcuts (skipped/focused tests).

##### Configuration

| Property       | Type                       | Default Value |
| -------------- | -------------------------- | ------------- |
| inline         | bool                       | false         |
| logTypeSkipped | enum (warn, fail, message) | warn          |
| logTypeFocused | enum (warn, fail, message) | warn          |
| logType        | enum (warn, fail, message) | warn          |

##### Usage

```
jsTestShortcuts();
jsTestShortcuts({ inline: true });
jsTestShortcuts({ logTypeSkipped: 'message', logTypeFocused: 'fail' });
jsTestShortcuts({ logType: 'fail' }); // Set both log types to "fail"
```

### reactBackpackCssModules

Recommend using [Backpack's `cssModules` utility](https://github.com/Skyscanner/backpack/tree/master/packages/bpk-react-utils#cssmodulesjs) in React components.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
reactBackpackCssModules();
reactBackpackCssModules({ logType: 'fail' });
```

### reactBackpackSubcomponents

Recommend using Backpack's sub-components (like [BpkButtonPrimary instead of BpkButton](https://github.com/Skyscanner/backpack/blob/master/CHANGELOG.md#2019-10-22---add-individual-exports-for-buttons)) in React components to reduce the amount of unused CSS and JS included.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
reactBackpackSubcomponents();
reactBackpackSubcomponents({ logType: 'fail' });
```

### reactRecommendClassProperties

Recommend using class properties to define `state` and PropTypes when creating React class components.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
reactRecommendClassProperties();
reactRecommendClassProperties({ logType: 'fail' });
```
