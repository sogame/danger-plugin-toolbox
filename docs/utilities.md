# danger-plugin-toolbox

## Utilities

### externalPr

Is this an external contribution (send from a fork)?

### committedFiles

List of all committed files (both added and modified).

### committedFilesGrep

Returns a list of all committed files that match the provided regex.

```
const testFiles = committedFilesGrep(/(\.test\.js|\.spec\.js)$/);
```

### isTrivial

Has this pull request been flagged as "trivial"? It's considered trivial when the pull request title and all commit messages contain `#trivial` or `[trivial]`.

### inCommit

Is the provided file name included in the pull request?

```
if (inCommit('package.json')) {
  ...
}
```

### inCommitGrep

Is the provided file name regex included in the pull request?

```
if (inCommitGrep(/.+\.log$/)) {
  ...
}
```

### fileAddedLines

Return the contents of all the lines that have been added in the provided file.

```
const addedLinesString = await fileAddedLines('file.js');
```

### fileRemovedLines

Return the contents of all the lines that have been removed in the provided file.

```
const removedLinesString = await fileRemovedLines('file.js');
```

### fileAddedLineMatch

Do the file added lines match a regex?

```
const someLineMatch = await fileAddedLineMatch('file.js', /pattern/);
if (someLineMatch) {
  ...
}
```

### fileRemovedLineMatch

Do the file removed lines match a regex?

```
const someLineMatch = await fileRemovedLineMatch('file.js', /pattern/);
if (someLineMatch) {
  ...
}
```

### fileAddedLineNumbers

Return the line number of all the lines that have been added in the provided file.

```
const addedLinesArray = await fileAddedLineNumbers('file.js');
```

### fileRemovedLineNumbers

Return the line number of all the lines that have been removed in the provided file.

```
const removedLinesArray = await fileRemovedLineNumbers('file.js');
```

### structuredFileAddedLines

Return an object with the content of all the lines that have been added in the provided file. The keys in the object are the line numbers.

```
const addedLines = await structuredFileAddedLines('file.js');
Object.entries(addedLines).forEach(([lineNumber, content]) => {
  ...
});
```

### structuredFileRemovedLines

Return an object with the content of all the lines that have been removed in the provided file. The keys in the object are the line numbers.

```
const removedLines = await structuredFileRemovedLines('file.js');
Object.entries(removedLines).forEach(([lineNumber, content]) => {
  ...
});
```

### structuredFileAddedLineMatches

Return an array with the line numbers of all the added lines that match a regex.

```
const lineNumbers = await structuredFileAddedLineMatches('file.js', /pattern/);
lineNumbers.forEach(lineNumber => {
  ...
});
```

### structuredFileRemovedLineMatches

Return an array with the line numbers of all the removed lines that match a regex.

```
const lineNumbers = await structuredFileRemovedLineMatches('file.js', /pattern/);
lineNumbers.forEach(lineNumber => {
  ...
});
```

### linkToTargetRepo

Get a link to a file in the target repository (the one where the pull request will be merged into).

Parameters:

1. `filename`: The file to link to.
1. `text`: The text to use for the link. Defaults to the value of `filename`.
1. `branch`: The branch to link to. Defaults to `master`.

```
const link1 = linkToTargetRepo('foler/file.js');
const link2 = linkToTargetRepo('CHANGELOG.md', 'changelog');
```

### linkToSourceRepo

Get a link to a file in the source repository (the one where the pull request is being send from).

Parameters:

1. `filename`: The file to link to.
1. `text`: The text to use for the link. Defaults to the value of `filename`.
1. `branch`: The branch to link to. Defaults to `master`.

```
const link1 = linkToSourceRepo('foler/file.js');
const link2 = linkToSourceRepo('CHANGELOG.md', 'changelog');
```

### createdFiles

Files added in the pull request (shorthand for `danger.git.created_files`).

### modifiedFiles

Files changed in the pull request (shorthand for `danger.git.modified_files`).

### commits

List of commits included in the pull request (shorthand for `danger.git.commits`).

### diffForFile

Return the diff for a specific file (shorthand for `danger.git.diffForFile`).

### prTitle

Title of the pull request (shorthand for `danger.github.pr.title`).

### prDescription

Description of the pull request (shorthand for `danger.github.pr.body`).

### prAuthor

Username of the author of the pull request (shorthand for `danger.github.pr.user.login`).

### targetBranch

Branch name where the pull request will be merged into (shorthand for `danger.github.pr.base.ref`).

### targetProjectId

Project ID where the pull request will be merged into (shorthand for `danger.github.pr.base.repo.id`).

### targetRepoUrl

Project repository url where the pull request will be merged into (shorthand for `danger.github.pr.base.repo.html_url`).

### sourceBranch

Branch name where the pull request is being send from (shorthand for `danger.github.pr.head.ref`).

### sourceProjectId

Project ID where the pull request is being send from (shorthand for `danger.github.pr.head.repo.id`).

### sourceRepoUrl

Project repository url where the pull request is being send from (shorthand for `danger.github.pr.head.repo.html_url`).

### href

Generate a link to a file in the repository (shorthand for `danger.utils.href`).
