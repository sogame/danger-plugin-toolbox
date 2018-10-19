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

### fileAddedLineMatch

Do the file added lines match a regex?

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

### sourceBranch

Branch name where the pull request is being send from (shorthand for `danger.github.pr.head.ref`).

### sourceProjectId

Project ID where the pull request is being send from (shorthand for `danger.github.pr.head.repo.id`).

### href

Generate a link to a file in the repository (shorthand for `danger.utils.href`).
