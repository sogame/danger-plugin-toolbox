const {
  git: {
    created_files: createdFiles,
    modified_files: modifiedFiles,
    commits,
    diffForFile,
  },
  github: {
    pr: {
      title: prTitle,
      body: prDescription,
      user: { login: prAuthor },
      base: {
        ref: targetBranch,
        repo: { id: targetProjectId },
      },
      head: {
        ref: sourceBranch,
        repo: { id: sourceProjectId },
      },
    },
  },
  utils: { href },
} = danger;

export {
  createdFiles,
  modifiedFiles,
  commits,
  diffForFile,
  prTitle,
  prDescription,
  prAuthor,
  targetBranch,
  targetProjectId,
  sourceBranch,
  sourceProjectId,
  href,
};

export const externalPr = sourceProjectId !== targetProjectId;

export const committedFiles = [...createdFiles, ...modifiedFiles];

export const committedFilesGrep = pattern =>
  committedFiles.filter(filename => filename.match(pattern) !== null);

const stringIncludesTrivial = str =>
  str.includes('#trivial') || str.includes('[trivial]');
const trivialTitle = stringIncludesTrivial(prTitle);
const trivialCommits = commits.reduce(
  (acc, { message: commitMessage }) =>
    acc && stringIncludesTrivial(commitMessage),
  true,
);
export const isTrivial = trivialTitle && trivialCommits;

export const inCommit = filename => committedFiles.includes(filename);

export const inCommitGrep = pattern =>
  committedFiles.findIndex(filename => filename.match(pattern) !== null) >= 0;

export const fileAddedLines = async filename => {
  const diff = await diffForFile(filename);
  const { added } = diff || {};
  return added || '';
};

export const fileAddedLineMatch = async (filename, pattern) => {
  const addedLines = await fileAddedLines(filename);
  return addedLines.match(pattern) !== null;
};
