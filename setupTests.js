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
  },
  github: {
    pr: {
      title: mockPrTitle,
      body: mockPrDescription,
      user: { login: mockPrAuthor },
      base: {
        ref: mockTargetBranch,
        repo: { id: mockTargetProjectId },
      },
      head: {
        ref: mockSourceBranch,
        repo: { id: mockSourceProjectId },
      },
    },
  },
  utils: { href: jest.fn() },
};

jest.mock('fs');
jest.mock('./src/rules/helpers');
