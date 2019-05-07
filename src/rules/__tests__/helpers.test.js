import {
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
  mockStructuredLinesAddedFile,
  mockHref,
  mockTargetRepoUrl,
  mockSourceRepoUrl,
} from '../__mocks__/dangerData';
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
  fileAddedLineMatch,
  structuredFileAddedLines,
  structuredFileAddedLineMatches,
  linkToTargetRepo,
  linkToSourceRepo,
} from '../helpers';

jest.unmock('../helpers');

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
    /*
    it('should expose the right externalPr (true)', () => {
    });

    it('should expose the right externalPr (false)', () => {
    });
    */

    it('should expose the right committedFiles', () => {
      const expected = [...mockCreatedFiles, ...mockModifiedFiles];
      expect(committedFiles).toEqual(expected);
    });

    /*
    it('should expose the right isTrivial', () => {
    });
    */
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

    describe('structuredFileAddedLines', () => {
      it('should return the added lines for the file', async () => {
        const filename = 'structuredFile1.js';
        const { chunks } = mockStructuredLinesAddedFile[filename];
        const changes = Object.values(chunks).reduce(
          (acc, { changes: curChanges }) => [...acc, ...curChanges],
          [],
        );
        const expected = changes.reduce((acc, { type, ln, content }) => {
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
});
