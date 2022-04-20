const {
  git: {
    commits,
    created_files: createdFiles,
    diffForFile,
    modified_files: modifiedFiles,
    structuredDiffForFile,
  },
  github: {
    pr: {
      base: {
        ref: targetBranch,
        repo: { html_url: targetRepoUrl, id: targetProjectId },
      },
      body: prDescription,
      head: {
        ref: sourceBranch,
        repo: { html_url: sourceRepoUrl, id: sourceProjectId },
      },
      title: prTitle,
      user: { login: prAuthor },
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
  targetRepoUrl,
  sourceBranch,
  sourceProjectId,
  sourceRepoUrl,
  href,
};

export const externalPr = sourceProjectId !== targetProjectId;

export const committedFiles = [...createdFiles, ...modifiedFiles];

export const committedFilesGrep = (pattern) =>
  committedFiles.filter(
    (filename) => filename && filename.match(pattern) !== null,
  );

const stringIncludesTrivial = (str) =>
  str.includes('#trivial') || str.includes('[trivial]');
const trivialTitle = stringIncludesTrivial(prTitle);
const trivialCommits = commits.reduce(
  (acc, { message: commitMessage }) =>
    acc && stringIncludesTrivial(commitMessage),
  true,
);
export const isTrivial = trivialTitle && trivialCommits;

export const inCommit = (filename) => committedFiles.includes(filename);

export const inCommitGrep = (pattern) =>
  committedFiles.findIndex(
    (filename) => filename && filename.match(pattern) !== null,
  ) >= 0;

export const fileAddedLines = async (filename) => {
  const diff = await diffForFile(filename);
  const { added } = diff || {};
  return added || '';
};

export const fileRemovedLines = async (filename) => {
  const diff = await diffForFile(filename);
  const { removed } = diff || {};
  return removed || '';
};

export const fileAddedLineMatch = async (filename, pattern) => {
  const addedLines = await fileAddedLines(filename);
  return addedLines.match(pattern) !== null;
};

export const fileRemovedLineMatch = async (filename, pattern) => {
  const removedLines = await fileRemovedLines(filename);
  return removedLines.match(pattern) !== null;
};

export const fileAddedLineNumbers = async (filename) => {
  const addedLines = [];
  const { chunks = [] } = (await structuredDiffForFile(filename)) || {};
  chunks.forEach(({ changes }) => {
    changes.forEach(({ ln, type }) => {
      if (type === 'add') {
        addedLines.push(ln);
      }
    });
  });
  return addedLines;
};

export const fileRemovedLineNumbers = async (filename) => {
  const removedLines = [];
  const { chunks = [] } = (await structuredDiffForFile(filename)) || {};
  chunks.forEach(({ changes }) => {
    changes.forEach(({ ln, type }) => {
      if (type === 'del') {
        removedLines.push(ln);
      }
    });
  });
  return removedLines;
};

export const structuredFileAddedLines = async (filename) => {
  const addedLines = {};
  const { chunks = [] } = (await structuredDiffForFile(filename)) || {};
  chunks.forEach(({ changes }) => {
    changes.forEach(({ content, ln, type }) => {
      if (type === 'add') {
        addedLines[ln] = content.substr(1);
      }
    });
  });
  return addedLines;
};

export const structuredFileRemovedLines = async (filename) => {
  const removedLines = {};
  const { chunks = [] } = (await structuredDiffForFile(filename)) || {};
  chunks.forEach(({ changes }) => {
    changes.forEach(({ content, ln, type }) => {
      if (type === 'del') {
        removedLines[ln] = content.substr(1);
      }
    });
  });
  return removedLines;
};

const findMatchingLines = (lines, pattern) => {
  const matches = [];
  Object.entries(lines).forEach(([line, content]) => {
    if (content.match(pattern) !== null) {
      matches.push(parseInt(line, 10));
    }
  });
  return matches;
};

export const structuredFileAddedLineMatches = async (filename, pattern) => {
  const addedLines = await structuredFileAddedLines(filename);
  return findMatchingLines(addedLines, pattern);
};

export const structuredFileRemovedLineMatches = async (filename, pattern) => {
  const removedLines = await structuredFileRemovedLines(filename);
  return findMatchingLines(removedLines, pattern);
};

const linkToRepo = (repoUrl, file, text, branch = 'master') => {
  const linkText = text || file;
  return href(`${repoUrl}/blob/${branch}/${file}`, linkText);
};

export const linkToTargetRepo = (file, text, branch) =>
  linkToRepo(targetRepoUrl, file, text, branch);

export const linkToSourceRepo = (file, text, branch) =>
  linkToRepo(sourceRepoUrl, file, text, branch);
