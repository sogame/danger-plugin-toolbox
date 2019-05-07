export const mockCreatedFiles = ['createdFile1.js', 'createdFile2.js'];

export const mockModifiedFiles = ['modifiedFile1.js', 'modifiedFile2.js'];

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
        content: '-line 20',
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
  'structuredDelOnly.js': { chunks: chunksDeletedOnly },
};

export const mockHref = (url, text) => `[[${url}||${text || ''}]]`;

export const mockTargetRepoUrl = 'http://www.github.com/target/repo';

export const mockSourceRepoUrl = 'http://www.github.com/source/repo';
