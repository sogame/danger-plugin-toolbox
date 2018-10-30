let mockFilesContent = {};
export const setMockFilesContent = newMockFilesContent => {
  mockFilesContent = Object.assign({}, newMockFilesContent);
};

let mockCommittedFiles = [];
export const setMockCommittedFiles = newMockFiles => {
  mockCommittedFiles = newMockFiles.slice();
};

export const inCommit = filename => mockCommittedFiles.includes(filename);

export const inCommitGrep = pattern =>
  mockCommittedFiles.findIndex(filename => filename.match(pattern) !== null) >=
  0;

export const committedFilesGrep = pattern =>
  mockCommittedFiles.filter(filename => filename.match(pattern) !== null);

export const href = (filename, text) => `[[${filename}||${text || ''}]]`;

export const fileAddedLineMatch = (filename, pattern) =>
  new Promise(resolve => {
    const fileContents = mockFilesContent[filename] || '';
    resolve(fileContents.match(pattern) !== null);
  });

const linkToRepo = (repoUrl, file, text, branch) =>
  `[[${repoUrl}||${file}||${text}||${branch}]]`;

export const linkToTargetRepo = (file, text, branch) =>
  linkToRepo('targetRepo', file, text, branch);

export const linkToSourceRepo = (file, text, branch) =>
  linkToRepo('sourceRepo', file, text, branch);
