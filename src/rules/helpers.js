const {
  git: {
    created_files: createdFiles,
    modified_files: modifiedFiles,
    commits,
    diffForFile,
    structuredDiffForFile,
  },
  github: {
    pr: {
      title: prTitle,
      body: prDescription,
      user: { login: prAuthor },
      base: {
        ref: targetBranch,
        repo: { id: targetProjectId, html_url: targetRepoUrl },
      },
      head: {
        ref: sourceBranch,
        repo: { id: sourceProjectId, html_url: sourceRepoUrl },
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
    changes.forEach(({ type, ln }) => {
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
    changes.forEach(({ type, ln }) => {
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
    changes.forEach(({ type, ln, content }) => {
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
    changes.forEach(({ type, ln, content }) => {
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
