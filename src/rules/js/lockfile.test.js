import * as helpers from '../helpers';
import jsLockfile from './lockfile';

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

  it('should not warn when package.json and package-lock.json have not been changed', () => {
    const files = ['file.js'];
    helpers.setMockCommittedFiles(files);

    jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when package.json and package-lock.json have changed', () => {
    const files = ['file.js', 'package.json', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when package.json has changed and package-lock.json has not', () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);

    const expectedMsg = getMessagePackage();

    jsLockfile();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should warn when package-lock.json has changed and package.json has not', () => {
    const files = ['file.js', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    const expectedMsg = getMessagePackageLock();

    jsLockfile();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should not warn when package.json has changed in a folder and the right "path" is not provided', () => {
    const path = 'folder/';
    const files = ['file.js', `${path}package.json`];
    helpers.setMockCommittedFiles(files);

    jsLockfile();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when package.json has changed in a folder and "path" is provided', () => {
    const path = 'folder/';
    const files = ['file.js', `${path}package.json`, 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    const expectedMsg = getMessagePackage(path);

    jsLockfile({ path });

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should log as "logTypePackage" when is provided', () => {
    const files = ['file.js', 'package.json'];
    helpers.setMockCommittedFiles(files);

    jsLockfile({ logTypePackage: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypePackageLock" when is provided', () => {
    const files = ['file.js', 'package-lock.json'];
    helpers.setMockCommittedFiles(files);

    jsLockfile({ logTypePackageLock: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
