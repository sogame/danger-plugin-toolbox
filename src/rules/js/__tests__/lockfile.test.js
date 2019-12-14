import fs from 'fs';

import * as helpers from '../../helpers';
import jsLockfile from '../lockfile';

const folderPath = 'folder/';
const packageFolderFilename = `${folderPath}package.json`;
const folderPathNoDeps = 'folderNoDeps/';
const packageNoDeps = `${folderPathNoDeps}package.json`;
const folderPathNoDevDeps = 'folderNoDevDeps/';
const packageNoDevDeps = `${folderPathNoDevDeps}package.json`;
const packageJson = `{
  "foo": "foo value",
  "bar": "bar value",
  "devDependencies": {
    "dev-dep1": "1.0.0",
    "dev-dep2": "2.0.0",
    "dev-dep3": "3.0.0",
  },
  "scripts": {
    "script1": "script 1",
    "script2": "script 2",
    "script3": "script 3"
  },
  "dependencies": {
    "dep1": "1.0.0",
    "dep2": "2.0.0",
    "dep3": "3.0.0",
  },
  "keywords": [
    "foo",
    "bar"
  ]
}`;
const packageJsonNoDeps = `{
  "foo": "foo value",
  "bar": "bar value",
  "devDependencies": {
    "dev-dep1": "1.0.0",
    "dev-dep2": "2.0.0",
    "dev-dep3": "3.0.0",
  },
  "scripts": {
    "script1": "script 1",
    "script2": "script 2",
    "script3": "script 3"
  },
  "keywords": [
    "foo",
    "bar"
  ]
}`;
const packageJsonNoDevDeps = `{
  "foo": "foo value",
  "bar": "bar value",
  "scripts": {
    "script1": "script 1",
    "script2": "script 2",
    "script3": "script 3"
  },
  "dependencies": {
    "dep1": "1.0.0",
    "dep2": "2.0.0",
    "dep3": "3.0.0",
  },
  "keywords": [
    "foo",
    "bar"
  ]
}`;
const mockFiles = {
  'package.json': packageJson,
  [packageFolderFilename]: packageJson,
  [packageNoDeps]: packageJsonNoDeps,
  [packageNoDevDeps]: packageJsonNoDevDeps,
};

const devDependenciesChangedStructure = {
  5: '',
  6: '',
};
const dependenciesChangedStructure = {
  2: '',
  16: '',
};
const noDependenciesChangedStructure = {
  2: '',
};

fs.setMockFiles(mockFiles);

const getMessagePackage = (path = '') =>
  `Dependencies (\`${path}package.json\`) may have changed, but lockfile (\`${path}package-lock.json\`) has not been updated.`;

const getMessagePackageLock = (path = '') =>
  `Lockfile (\`${path}package-lock.json\`) has been updated, but no dependencies (\`${path}package.json\`) have changed.`;

describe('jsLockfile', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when package.json and package-lock.json have not been changed', async () => {
    const files = ['file.js'];
    helpers.setMockCommittedFiles(files);

    await jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when dependencies in package.json and package-lock.json have changed', async () => {
    const files = ['file.js', 'package.json', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': dependenciesChangedStructure,
    });

    await jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when devDependencies in package.json and package-lock.json have changed', async () => {
    const files = ['file.js', 'package.json', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': devDependenciesChangedStructure,
    });

    await jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when dependencies/devDependencies in package.json and package-lock.json have not changed', async () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': noDependenciesChangedStructure,
    });

    await jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when dependencies in package.json have changed and package-lock.json has not', async () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': dependenciesChangedStructure,
    });

    const expectedMsg = getMessagePackage();

    await jsLockfile();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should warn when devDependencies in package.json have changed and package-lock.json has not', async () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': devDependenciesChangedStructure,
    });

    const expectedMsg = getMessagePackage();

    await jsLockfile();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should warn when package-lock.json has changed and package.json has not', async () => {
    const files = ['file.js', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    const expectedMsg = getMessagePackageLock();

    await jsLockfile();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should not warn when package.json has changed in a folder and the right "path" is not provided', async () => {
    const files = ['file.js', packageFolderFilename];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      [packageFolderFilename]: dependenciesChangedStructure,
    });

    await jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when package.json has changed in a folder and "path" is provided', async () => {
    const files = ['file.js', packageFolderFilename, 'package-lock.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      [packageFolderFilename]: dependenciesChangedStructure,
    });

    const expectedMsg = getMessagePackage(folderPath);

    await jsLockfile({ path: folderPath });

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should not warn when dependencies do not exist in package.json and package-lock.json has not changed', async () => {
    const files = ['file.js', packageNoDeps];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      [packageNoDeps]: noDependenciesChangedStructure,
    });

    await jsLockfile({ path: folderPathNoDeps });

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when devDependencies do not exist in package.json and package-lock.json has not changed', async () => {
    const files = ['file.js', packageNoDevDeps];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      [packageNoDevDeps]: noDependenciesChangedStructure,
    });

    await jsLockfile({ path: folderPathNoDevDeps });

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should log as "logTypePackage" when is provided', async () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': dependenciesChangedStructure,
    });

    await jsLockfile({ logTypePackage: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypePackage" when "logType" is also provided', async () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': dependenciesChangedStructure,
    });

    await jsLockfile({
      logTypePackage: 'fail',
      logType: 'message',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypePackageLock" when is provided', async () => {
    const files = ['file.js', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    await jsLockfile({ logTypePackageLock: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypePackageLock" when "logType" is also provided', async () => {
    const files = ['file.js', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    await jsLockfile({
      logTypePackageLock: 'fail',
      logType: 'message',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logType" when provided but "logTypePackage" is not', async () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);
    helpers.setFilesStructuredAddedLines({
      'package.json': dependenciesChangedStructure,
    });

    await jsLockfile({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logType" when provided but "logTypePackageLock" is not', async () => {
    const files = ['file.js', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    await jsLockfile({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
