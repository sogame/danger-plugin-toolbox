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

export const mockHref = (url, text) => `[[${url}||${text || ''}]]`;

export const mockTargetRepoUrl = 'http://www.github.com/target/repo';

export const mockSourceRepoUrl = 'http://www.github.com/source/repo';
