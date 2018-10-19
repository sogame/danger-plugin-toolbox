# danger-plugin-toolbox

## Validations

Most of the validations add a warning message in the Danger comment when the check fails. The message type (failure, warning, info) can be configured when using each validation.

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

| Property | Type   |
| -------- | ------ |
| msg      | string |

##### Usage

```
commonContribution();
commonContribution({ msg: 'Many thanks for your collaboration!' });
```

### commonFileExists

Make sure the files exist in the repo.

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

### commonPrDescription

Check there is a description in the pull request (unless the pull request is flagged as [trivial](utilities.md#istrivial) or it is from `dev` or `develop` into `master`).

##### Configuration

| Property  | Type                       | Default Value |
| --------- | -------------------------- | ------------- |
| logType   | enum (warn, fail, message) | warn          |
| minLength | integer                    | 5             |

##### Usage

```
commonPrDescription();
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

##### Usage

```
commonPrDescriptionContribution();
commonPrDescriptionContribution({ logType: 'message' });
commonPrDescriptionContribution({ minLength: 10, logType: 'fail' });
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

Recommend using [Backpack](https://backpack.github.io/) variables/spacings (or whole multiples of them) instead of creating new values.

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
cssBackpackVariables();
cssBackpackVariables({ logType: 'fail' });
```

### cssGlobalStylelintChange

Check if global stylelint configuration (`.stylelintrc`) or `.stylelintignore` have been modified.

##### Configuration

| Property               | Type                       | Default Value |
| ---------------------- | -------------------------- | ------------- |
| logTypeStylelintrc     | enum (warn, fail, message) | warn          |
| logTypeStylelintignore | enum (warn, fail, message) | warn          |
| path                   | string                     | ''            |

##### Usage

```
cssGlobalStylelintChange();
cssGlobalStylelintChange({ logTypeStylelintrc: 'fail', logTypeStylelintignore: 'message' });
cssGlobalStylelintChange({ path: 'another/folder/' });
```

### cssLocalStylelintChange

Check if stylelint has been disabled in the commited files (scss or css).

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
cssLocalStylelintChange();
cssLocalStylelintChange({ logType: 'fail' });
```

### cssRemOverEm

Check if `em` are used instead of `rem` in the commited files (scss or css).

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
cssRemOverEm();
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

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
jsConsoleCommands();
jsConsoleCommands({ logType: 'fail' });
```

### jsGlobalEslintChange

Check if global eslint configuration (`.eslintrc`) or `.eslintignore` have been modified.

##### Configuration

| Property            | Type                       | Default Value |
| ------------------- | -------------------------- | ------------- |
| logTypeEslintrc     | enum (warn, fail, message) | warn          |
| logTypeEslintignore | enum (warn, fail, message) | warn          |
| path                | string                     | ''            |

##### Usage

```
jsGlobalEslintChange();
jsGlobalEslintChange({ logTypeEslintrc: 'fail', logTypeEslintignore: 'message' });
jsGlobalEslintChange({ path: 'another/folder/' });
```

### jsLocalEslintChange

Check if eslint has been disabled in the commited files (js or jsx).

##### Configuration

| Property | Type                       | Default Value |
| -------- | -------------------------- | ------------- |
| logType  | enum (warn, fail, message) | warn          |

##### Usage

```
jsLocalEslintChange();
jsLocalEslintChange({ logType: 'fail' });
```

### jsLockfile

If dependencies change (changes in `package.json`), `package-lock.json` also must be updated.

##### Configuration

| Property           | Type                       | Default Value |
| ------------------ | -------------------------- | ------------- |
| logTypePackage     | enum (warn, fail, message) | warn          |
| logTypePackageLock | enum (warn, fail, message) | warn          |
| path               | string                     | ''            |

##### Usage

```
jsLockfile();
jsLockfile({ logTypePackage: 'fail', logTypePackageLock: 'message' });
jsLockfile({ path: 'another/folder/' });
```

### jsTestShortcuts

Check if there are test shortcuts (skipped/focused tests).

##### Configuration

| Property       | Type                       | Default Value |
| -------------- | -------------------------- | ------------- |
| logTypeSkipped | enum (warn, fail, message) | warn          |
| logTypeFocused | enum (warn, fail, message) | warn          |

##### Usage

```
jsTestShortcuts();
jsTestShortcuts({ logTypeSkipped: 'message', logTypeFocused: 'fail' });
```

```

```
