let mockFilesContent = {};
export const setMockFilesContent = newMockFilesContent => {
  mockFilesContent = Object.assign({}, newMockFilesContent);
};

let mockCommittedFiles = [];
export const setMockCommittedFiles = newMockFiles => {
  mockCommittedFiles = newMockFiles.slice();
};

let mockFilesStructuredAddedLines = {};
export const setFilesStructuredAddedLines = newStructuredLinesFiles => {
  mockFilesStructuredAddedLines = Object.assign({}, newStructuredLinesFiles);
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

export const fileAddedLineNumbers = filename =>
  new Promise(resolve => {
    const structuredLines = mockFilesStructuredAddedLines[filename] || {};
    resolve(Object.keys(structuredLines).map(lineStr => parseInt(lineStr, 10)));
  });

export const structuredFileAddedLines = filename =>
  new Promise(resolve => {
    const structuredLines = mockFilesStructuredAddedLines[filename] || {};
    resolve(structuredLines);
  });

export const structuredFileAddedLineMatches = (filename, pattern) =>
  new Promise(resolve => {
    const addedLines = mockFilesStructuredAddedLines[filename] || {};
    const matches = [];
    Object.entries(addedLines).forEach(([line, content]) => {
      if (content.match(pattern) !== null) {
        matches.push(parseInt(line, 10));
      }
    });
    resolve(matches);
  });

const linkToRepo = (repoUrl, file, text, branch) =>
  `[[${repoUrl}||${file}||${text}||${branch}]]`;

export const linkToTargetRepo = (file, text, branch) =>
  linkToRepo('targetRepo', file, text, branch);

export const linkToSourceRepo = (file, text, branch) =>
  linkToRepo('sourceRepo', file, text, branch);
