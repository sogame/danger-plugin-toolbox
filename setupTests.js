import {
  mockPrTitle,
  mockCreatedFiles,
  mockModifiedFiles,
  mockCommits,
  mockPrDescription,
  mockPrAuthor,
  mockTargetBranch,
  mockTargetProjectId,
  mockSourceBranch,
  mockSourceProjectId,
  mockLinesAddedFile,
  mockStructuredLinesAddedFile,
  mockHref,
  mockTargetRepoUrl,
  mockSourceRepoUrl,
} from './src/rules/__mocks__/dangerData';

global.danger = {
  git: {
    created_files: mockCreatedFiles,
    modified_files: mockModifiedFiles,
    commits: mockCommits,
    diffForFile: filename =>
      new Promise(resolve => {
        const added = mockLinesAddedFile[filename];
        const result = added ? { added } : null;
        resolve(result);
      }),
    structuredDiffForFile: filename =>
      new Promise(resolve => {
        const diff = mockStructuredLinesAddedFile[filename];
        resolve(diff);
      }),
  },
  github: {
    pr: {
      title: mockPrTitle,
      body: mockPrDescription,
      user: { login: mockPrAuthor },
      base: {
        ref: mockTargetBranch,
        repo: { id: mockTargetProjectId, html_url: mockTargetRepoUrl },
      },
      head: {
        ref: mockSourceBranch,
        repo: { id: mockSourceProjectId, html_url: mockSourceRepoUrl },
      },
    },
  },
  utils: { href: (...params) => mockHref(...params) },
};

jest.mock('fs');
jest.mock('./src/rules/helpers');
