export const mockCreatedFiles = ['createdFile1.js', 'createdFile2.js', null];

export const mockModifiedFiles = ['modifiedFile1.js', null, 'modifiedFile2.js'];

export const mockCommits = [
  { message: 'Commit 1' },
  { message: 'Commit 2' },
  { message: 'Commit 3' },
];

export const mockPrTitle = 'The PR title';

export const mockPrDescription = 'The PR description';

export const mockPrAuthor = 'PR Author';

export const mockTargetBranch = 'Target Branch';

export const mockTargetProjectId = 'Target Project ID';

export const mockSourceBranch = 'Source Branch';

export const mockSourceProjectId = 'Source Project ID';

export const mockLinesAddedFile = {
  'file1.js': 'lines added file1',
};

export const mockLinesRemovedFile = {
  'file1.js': 'lines removed file1',
};

const chunksFile1 = [
  {
    changes: [
      {
        type: 'add',
        ln: 1,
        content: '+line added 1',
      },
      {
        type: 'normal',
        ln: 2,
        content: 'line 2',
      },
      {
        type: 'del',
        ln: 4,
        content: '-line removed 4',
      },
    ],
  },
  {
    changes: [
      {
        type: 'normal',
        ln: 10,
        content: 'line 10',
      },
      {
        type: 'add',
        ln: 11,
        content: '+line 11',
      },
      {
        type: 'add',
        ln: 12,
        content: '+line added 12',
      },
    ],
  },
  {
    changes: [
      {
        type: 'del',
        ln: 20,
        content: '-line removed 20',
      },
    ],
  },
];

const chunksAddedOnly = [
  {
    changes: [
      {
        type: 'normal',
        ln: 2,
        content: 'line 2',
      },
      {
        type: 'add',
        ln: 4,
        content: '+line 4',
      },
    ],
  },
  {
    changes: [
      {
        type: 'normal',
        ln: 10,
        content: 'line 10',
      },
      {
        type: 'add',
        ln: 11,
        content: '+line 11',
      },
      {
        type: 'add',
        ln: 12,
        content: '+line 12',
      },
    ],
  },
  {
    changes: [
      {
        type: 'add',
        ln: 20,
        content: '+line 20',
      },
    ],
  },
];

const chunksDeletedOnly = [
  {
    changes: [
      {
        type: 'normal',
        ln: 2,
        content: 'line 2',
      },
      {
        type: 'del',
        ln: 4,
        content: '-line 4',
      },
    ],
  },
  {
    changes: [
      {
        type: 'normal',
        ln: 10,
        content: 'line 10',
      },
      {
        type: 'del',
        ln: 11,
        content: '-line 11',
      },
      {
        type: 'del',
        ln: 12,
        content: '-line 12',
      },
    ],
  },
  {
    changes: [
      {
        type: 'del',
        ln: 20,
        content: '-line 20',
      },
    ],
  },
];

export const mockStructuredLinesAddedFile = {
  'structuredFile1.js': { chunks: chunksFile1 },
  'structuredAddOnly.js': { chunks: chunksAddedOnly },
  'structuredDelOnly.js': { chunks: chunksDeletedOnly },
};

export const mockHref = (url, text) => `[[${url}||${text || ''}]]`;

export const mockTargetRepoUrl = 'http://www.github.com/target/repo';

export const mockSourceRepoUrl = 'http://www.github.com/source/repo';

export const mockCodeowners = `
* @user1

# absolute
/absolute_file.js @user1 @user3
/some/folder/file.js @user2 @user3
/yet/another/folder/slash/ @user2 @user4

# relative
relative_file.js @user3
relative/file.js @user4

__tests__ @tester1
__tests2__/file2.js @tester2
**/__other_tests__ @tester3
__more_tests__/** @tester4

duplicated/ @duplicated1
duplicated/ @duplicated2
duplicated/new_owner.js @duplicated3

option/{file1,file2}.js @user9

{option1/folder,option2/another/path}/common @subfolders
{/option3/folder,/option4/another/path}/common @subfoldersRoot
`;
