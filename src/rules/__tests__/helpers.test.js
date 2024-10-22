import fs from 'fs';

import {
  mockCodeowners,
  mockCreatedFiles,
  mockModifiedFiles,
  mockCommits,
  mockPrTitle,
  mockPrDescription,
  mockPrAuthor,
  mockTargetBranch,
  mockTargetProjectId,
  mockSourceBranch,
  mockSourceProjectId,
  mockLinesAddedFile,
  mockLinesRemovedFile,
  mockStructuredLinesAddedFile,
  mockHref,
  mockTargetRepoUrl,
  mockSourceRepoUrl,
} from '../__fixtures__/dangerData';
import {
  createdFiles,
  modifiedFiles,
  commits,
  prTitle,
  prDescription,
  prAuthor,
  targetBranch,
  targetProjectId,
  sourceBranch,
  sourceProjectId,
  committedFiles,
  committedFilesGrep,
  inCommit,
  inCommitGrep,
  fileAddedLines,
  fileRemovedLines,
  fileAddedLineMatch,
  fileRemovedLineMatch,
  fileAddedLineNumbers,
  fileRemovedLineNumbers,
  getFileOwners,
  structuredFileAddedLines,
  structuredFileRemovedLines,
  structuredFileAddedLineMatches,
  structuredFileRemovedLineMatches,
  linkToTargetRepo,
  linkToSourceRepo,
} from '../helpers';

jest.unmock('../helpers');

const mockFiles = {
  CODEOWNERS: mockCodeowners,
};

fs.setMockFiles(mockFiles);

describe('helpers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('danger exports (const)', () => {
    it('should expose the right createdFiles', () => {
      expect(createdFiles).toEqual(mockCreatedFiles);
    });

    it('should expose the right modifiedFiles', () => {
      expect(modifiedFiles).toEqual(mockModifiedFiles);
    });

    it('should expose the right commits', () => {
      expect(commits).toEqual(mockCommits);
    });

    it('should expose the right prTitle', () => {
      expect(prTitle).toEqual(mockPrTitle);
    });

    it('should expose the right prDescription', () => {
      expect(prDescription).toEqual(mockPrDescription);
    });

    it('should expose the right prAuthor', () => {
      expect(prAuthor).toEqual(mockPrAuthor);
    });

    it('should expose the right targetBranch', () => {
      expect(targetBranch).toEqual(mockTargetBranch);
    });

    it('should expose the right targetProjectId', () => {
      expect(targetProjectId).toEqual(mockTargetProjectId);
    });

    it('should expose the right sourceBranch', () => {
      expect(sourceBranch).toEqual(mockSourceBranch);
    });

    it('should expose the right sourceProjectId', () => {
      expect(sourceProjectId).toEqual(mockSourceProjectId);
    });
  });

  describe('helpers exports (const)', () => {
    describe('externalPr', () => {
      it('should return "false" when the pr is from the same repo', () => {
        global.danger.github.pr.base.repo.id = '42';
        global.danger.github.pr.head.repo.id = '42';

        jest.resetModules();
        // eslint-disable-next-line global-require -- Haven't found another way get the value based on the mock data
        const { externalPr } = require('../helpers');

        expect(externalPr).toBe(false);
      });

      it('should return "true" when the pr is from a different repo', () => {
        global.danger.github.pr.base.repo.id = '42';
        global.danger.github.pr.head.repo.id = '99';

        jest.resetModules();
        // eslint-disable-next-line global-require -- Haven't found another way get the value based on the mock data
        const { externalPr } = require('../helpers');

        expect(externalPr).toBe(true);
      });
    });

    it('should expose the right committedFiles', () => {
      const expected = [...mockCreatedFiles, ...mockModifiedFiles];

      expect(committedFiles).toEqual(expected);
    });

    describe('isTrivial', () => {
      it('should return "true" when pr title and all commits are trivial', () => {
        global.danger.github.pr.title = '[trivial] Fooo';
        global.danger.git.commits = [
          { message: '#trivial Commit 1' },
          { message: '[trivial] Commit 2' },
          { message: '[trivial] Commit 3' },
        ];

        jest.resetModules();
        // eslint-disable-next-line global-require -- Haven't found another way get the value based on the mock data
        const { isTrivial } = require('../helpers');

        expect(isTrivial).toBe(true);
      });

      it('should return "false" when pr title is not trivial', () => {
        global.danger.github.pr.title = 'Fooo';
        global.danger.git.commits = [
          { message: '#trivial Commit 1' },
          { message: '[trivial] Commit 2' },
          { message: '[trivial] Commit 3' },
        ];

        jest.resetModules();
        // eslint-disable-next-line global-require -- Haven't found another way get the value based on the mock data
        const { isTrivial } = require('../helpers');

        expect(isTrivial).toBe(false);
      });

      it('should return "false" when any commit is not trivial', () => {
        global.danger.github.pr.title = '[trivial] Fooo';
        global.danger.git.commits = [
          { message: '#trivial Commit 1' },
          { message: 'Commit 2' },
          { message: '[trivial] Commit 3' },
        ];

        jest.resetModules();
        // eslint-disable-next-line global-require -- Haven't found another way get the value based on the mock data
        const { isTrivial } = require('../helpers');

        expect(isTrivial).toBe(false);
      });
    });
  });

  describe('helpers exports (functions)', () => {
    describe('committedFilesGrep', () => {
      it('should return no files when the pattern does not match any file', () => {
        const pattern = /fake/;
        const expected = [];

        const result = committedFilesGrep(pattern);

        expect(result).toEqual(expected);
      });

      it('should return files when the pattern does match some files', () => {
        const pattern = /File1/;
        const expected = ['createdFile1.js', 'modifiedFile1.js'];

        const result = committedFilesGrep(pattern);

        expect(result).toEqual(expected);
      });
    });

    describe('inCommit', () => {
      it('should return false when the file is not committed', () => {
        const file = 'notCommitted.js';
        const expected = false;

        const result = inCommit(file);

        expect(result).toEqual(expected);
      });

      it('should return true when the file is committed', () => {
        const file = 'createdFile2.js';
        const expected = true;

        const result = inCommit(file);

        expect(result).toEqual(expected);
      });
    });

    describe('inCommitGrep', () => {
      it('should return false when the pattern does not match any file', () => {
        const pattern = /fake/;
        const expected = false;

        const result = inCommitGrep(pattern);

        expect(result).toEqual(expected);
      });

      it('should return true when the pattern does match some files', () => {
        const pattern = /File1/;
        const expected = true;

        const result = inCommitGrep(pattern);

        expect(result).toEqual(expected);
      });
    });

    describe('fileAddedLines', () => {
      it('should return the added lines for the file', async () => {
        const filename = 'file1.js';
        const expected = mockLinesAddedFile[filename];

        const result = await fileAddedLines(filename);

        expect(result).toEqual(expected);
      });

      it('should return empty when the file is not in the commit', async () => {
        const filename = 'invalidFile.js';
        const expected = '';

        const result = await fileAddedLines(filename);

        expect(result).toEqual(expected);
      });
    });

    describe('fileRemovedLines', () => {
      it('should return the removed lines for the file', async () => {
        const filename = 'file1.js';
        const expected = mockLinesRemovedFile[filename];

        const result = await fileRemovedLines(filename);

        expect(result).toEqual(expected);
      });

      it('should return empty when the file is not in the commit', async () => {
        const filename = 'invalidFile.js';
        const expected = '';

        const result = await fileRemovedLines(filename);

        expect(result).toEqual(expected);
      });
    });

    describe('fileAddedLineMatch', () => {
      it('should return true when added lines match the pattern', async () => {
        const filename = 'file1.js';
        const pattern = /added file1/;

        const expected = true;

        const result = await fileAddedLineMatch(filename, pattern);

        expect(result).toEqual(expected);
      });

      it('should return false when added lines do not match the pattern', async () => {
        const filename = 'file1.js';
        const pattern = /fake content/;

        const expected = false;

        const result = await fileAddedLineMatch(filename, pattern);

        expect(result).toEqual(expected);
      });
    });

    describe('fileRemovedLineMatch', () => {
      it('should return true when removed lines match the pattern', async () => {
        const filename = 'file1.js';
        const pattern = /removed file1/;

        const expected = true;

        const result = await fileRemovedLineMatch(filename, pattern);

        expect(result).toEqual(expected);
      });

      it('should return false when removed lines do not match the pattern', async () => {
        const filename = 'file1.js';
        const pattern = /fake content/;

        const expected = false;

        const result = await fileRemovedLineMatch(filename, pattern);

        expect(result).toEqual(expected);
      });
    });

    describe('fileAddedLineNumbers', () => {
      it('should return the list of added lines when the file has added lines', async () => {
        const filename = 'structuredFile1.js';
        const expected = [1, 11, 12];

        const result = await fileAddedLineNumbers(filename);

        expect(result).toEqual(expected);
      });

      it('should return an empty array when the file has no added lines', async () => {
        const filename = 'structuredDelOnly.js';
        const expected = [];

        const result = await fileAddedLineNumbers(filename);

        expect(result).toEqual(expected);
      });

      it('should return an empty array when the file is not in the commit', async () => {
        const filename = 'invalidFile.js';
        const expected = [];

        const result = await fileAddedLineNumbers(filename);

        expect(result).toEqual(expected);
      });
    });

    describe('fileRemovedLineNumbers', () => {
      it('should return the list of removed lines when the file has removed lines', async () => {
        const filename = 'structuredFile1.js';
        const expected = [4, 20];

        const result = await fileRemovedLineNumbers(filename);

        expect(result).toEqual(expected);
      });

      it('should return an empty array when the file has no removed lines', async () => {
        const filename = 'structuredAddOnly.js';
        const expected = [];

        const result = await fileRemovedLineNumbers(filename);

        expect(result).toEqual(expected);
      });

      it('should return an empty array when the file is not in the commit', async () => {
        const filename = 'invalidFile.js';
        const expected = [];

        const result = await fileRemovedLineNumbers(filename);

        expect(result).toEqual(expected);
      });
    });

    describe('structuredFileAddedLines', () => {
      it('should return the added lines for the file', async () => {
        const filename = 'structuredFile1.js';
        const { chunks } = mockStructuredLinesAddedFile[filename];
        const changes = Object.values(chunks).reduce(
          (acc, { changes: curChanges }) => [...acc, ...curChanges],
          [],
        );
        const expected = changes.reduce((acc, { content, ln, type }) => {
          if (type === 'add') {
            acc[ln] = content.substr(1);
          }
          return acc;
        }, {});

        const result = await structuredFileAddedLines(filename);

        expect(result).toEqual(expected);
      });

      it('should return empty object when the file has no additions', async () => {
        const filename = 'structuredDelOnly.js';
        const expected = {};

        const result = await structuredFileAddedLines(filename);

        expect(result).toEqual(expected);
      });

      it('should return empty object when the file is not in the commit', async () => {
        const filename = 'invalidFile.js';
        const expected = {};

        const result = await structuredFileAddedLines(filename);

        expect(result).toEqual(expected);
      });
    });

    describe('structuredFileRemovedLines', () => {
      it('should return the removed lines for the file', async () => {
        const filename = 'structuredFile1.js';
        const { chunks } = mockStructuredLinesAddedFile[filename];
        const changes = Object.values(chunks).reduce(
          (acc, { changes: curChanges }) => [...acc, ...curChanges],
          [],
        );
        const expected = changes.reduce((acc, { content, ln, type }) => {
          if (type === 'del') {
            acc[ln] = content.substr(1);
          }
          return acc;
        }, {});

        const result = await structuredFileRemovedLines(filename);

        expect(result).toEqual(expected);
      });

      it('should return empty object when the file has no lines removed', async () => {
        const filename = 'structuredAddOnly.js';
        const expected = {};

        const result = await structuredFileRemovedLines(filename);

        expect(result).toEqual(expected);
      });

      it('should return empty object when the file is not in the commit', async () => {
        const filename = 'invalidFile.js';
        const expected = {};

        const result = await structuredFileRemovedLines(filename);

        expect(result).toEqual(expected);
      });
    });

    describe('structuredFileAddedLineMatches', () => {
      it('should return the line numbers for the lines that match', async () => {
        const filename = 'structuredFile1.js';
        const pattern = /line added/;

        const expected = [1, 12];

        const result = await structuredFileAddedLineMatches(filename, pattern);

        expect(result).toEqual(expected);
      });

      it('should return empty array when there are not matches', async () => {
        const filename = 'structuredFile1.js';
        const pattern = /foo/;

        const expected = [];

        const result = await structuredFileAddedLineMatches(filename, pattern);

        expect(result).toEqual(expected);
      });

      it('should return empty array when there are no additions', async () => {
        const filename = 'structuredDelOnly.js';
        const pattern = /line/;

        const expected = [];

        const result = await structuredFileAddedLineMatches(filename, pattern);

        expect(result).toEqual(expected);
      });
    });

    describe('structuredFileARemovedineMatches', () => {
      it('should return the line numbers for the lines that match', async () => {
        const filename = 'structuredFile1.js';
        const pattern = /line removed/;

        const expected = [4, 20];

        const result = await structuredFileRemovedLineMatches(
          filename,
          pattern,
        );

        expect(result).toEqual(expected);
      });

      it('should return empty array when there are not matches', async () => {
        const filename = 'structuredFile1.js';
        const pattern = /foo/;

        const expected = [];

        const result = await structuredFileRemovedLineMatches(
          filename,
          pattern,
        );

        expect(result).toEqual(expected);
      });

      it('should return empty array when there are no removed lines', async () => {
        const filename = 'structuredAddOnly.js';
        const pattern = /line/;

        const expected = [];

        const result = await structuredFileRemovedLineMatches(
          filename,
          pattern,
        );

        expect(result).toEqual(expected);
      });
    });

    describe('linkToTargetRepo', () => {
      it('should return the url for the file', () => {
        const filename = 'file.js';

        const expectedRepoUrl = `${mockTargetRepoUrl}/blob/master/${filename}`;
        const expected = mockHref(expectedRepoUrl, filename);

        const result = linkToTargetRepo(filename);

        expect(result).toEqual(expected);
      });

      it('should return the url for the file with the defined text', () => {
        const filename = 'file.js';
        const linkText = 'link text';

        const expectedRepoUrl = `${mockTargetRepoUrl}/blob/master/${filename}`;
        const expected = mockHref(expectedRepoUrl, linkText);

        const result = linkToTargetRepo(filename, linkText);

        expect(result).toEqual(expected);
      });

      it('should return the url for the file for the defined branch', () => {
        const filename = 'file.js';
        const branch = 'branch_name';

        const expectedRepoUrl = `${mockTargetRepoUrl}/blob/${branch}/${filename}`;
        const expected = mockHref(expectedRepoUrl, filename);

        const result = linkToTargetRepo(filename, null, branch);

        expect(result).toEqual(expected);
      });

      it('should return the url for the file for the defined branch with the defined text', () => {
        const filename = 'file.js';
        const branch = 'branch_name';
        const linkText = 'link text';

        const expectedRepoUrl = `${mockTargetRepoUrl}/blob/${branch}/${filename}`;
        const expected = mockHref(expectedRepoUrl, linkText);

        const result = linkToTargetRepo(filename, linkText, branch);

        expect(result).toEqual(expected);
      });
    });

    describe('linkToSourceRepo', () => {
      it('should return the url for the file', () => {
        const filename = 'file.js';

        const expectedRepoUrl = `${mockSourceRepoUrl}/blob/master/${filename}`;
        const expected = mockHref(expectedRepoUrl, filename);

        const result = linkToSourceRepo(filename);

        expect(result).toEqual(expected);
      });

      it('should return the url for the file with the defined text', () => {
        const filename = 'file.js';
        const linkText = 'link text';

        const expectedRepoUrl = `${mockSourceRepoUrl}/blob/master/${filename}`;
        const expected = mockHref(expectedRepoUrl, linkText);

        const result = linkToSourceRepo(filename, linkText);

        expect(result).toEqual(expected);
      });

      it('should return the url for the file for the defined branch', () => {
        const filename = 'file.js';
        const branch = 'branch_name';

        const expectedRepoUrl = `${mockSourceRepoUrl}/blob/${branch}/${filename}`;
        const expected = mockHref(expectedRepoUrl, filename);

        const result = linkToSourceRepo(filename, null, branch);

        expect(result).toEqual(expected);
      });

      it('should return the url for the file for the defined branch with the defined text', () => {
        const filename = 'file.js';
        const branch = 'branch_name';
        const linkText = 'link text';

        const expectedRepoUrl = `${mockSourceRepoUrl}/blob/${branch}/${filename}`;
        const expected = mockHref(expectedRepoUrl, linkText);

        const result = linkToSourceRepo(filename, linkText, branch);

        expect(result).toEqual(expected);
      });
    });
  });

  describe('getFileOwners', () => {
    describe('files', () => {
      it('absolute file', () => {
        const filename = '/absolute_file.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@user1', '@user3']);
      });

      it('absolute file in folder', () => {
        const filename = '/some/folder/file.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@user2', '@user3']);
      });

      it('relative file', () => {
        const filename = '/root/folder/relative_file.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@user3']);
      });

      it('relative file in folder', () => {
        const filename = '/root/another/relative/file.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@user4']);
      });

      it('should return "undefined" when there are no owners for the file', () => {
        const filename = '/fake_file.js';

        const result = getFileOwners(filename);

        expect(result).toBeUndefined();
      });
    });

    describe('folders', () => {
      it('relative folder', () => {
        const filename = '/root/some/folder/__tests__/file1.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@tester1']);
      });

      it('relative folder (** before)', () => {
        const filename = '/root/some/folder/__other_tests__/file1.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@tester3']);
      });

      it('relative folder (** after)', () => {
        const filename = '/root/some/folder/__more_tests__/file1.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@tester4']);
      });

      it('relative folder (/ ending)', () => {
        const filename = '/yet/another/folder/slash/file1.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@user2', '@user4']);
      });

      it('file in relative folder', () => {
        const filename = '/root/some/folder/__tests2__/file2.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@tester2']);
      });

      it('file in option', () => {
        const filename = '/root/option/file2.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@user9']);
      });

      it('relative folder in option', () => {
        const filename = '/root/option1/folder/common/file.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@subfolders']);
      });

      it('absolute folder in option', () => {
        const filename = '/option4/another/path/common/file.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@subfoldersRoot']);
      });
    });

    describe('duplicated', () => {
      it('duplicated folder', () => {
        const filename = '/root/duplicated/file.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@duplicated2']);
      });

      it('only subfile owned', () => {
        const filename = '/root/duplicated/new_owner.js';

        const result = getFileOwners(filename);

        expect(result).toEqual(['@duplicated3']);
      });
    });
  });
});
