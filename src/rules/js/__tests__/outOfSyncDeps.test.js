import fs from 'fs';

import jsOutOfSyncDeps from '../outOfSyncDeps';

const buildDepMessage = (name, version, versionLock) =>
  `<tr><td>${name}</td><td>${version}</td><td>${versionLock}</td></tr>`;

describe('jsOutOfSyncDeps', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when dependencies are in sync', () => {
    const validDeps = {
      dependencies: {
        dep1: '~1.2.3',
        dep3: '^3.4.5',
      },
    };
    const packageLockJson = {
      dependencies: {
        dep1: { version: '1.2.3' },
        dep3: { version: '3.4.5' },
      },
    };
    const mockFiles = {
      'package.json': JSON.stringify(validDeps),
      'package-lock.json': JSON.stringify(packageLockJson),
    };
    fs.setMockFiles(mockFiles);

    jsOutOfSyncDeps();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when dependencies are out of sync', () => {
    const packageJson = {
      dependencies: {
        dep1: '~1.2.3',
        dep2: '^2.3.4',
        dep3: '^3.4.5',
        dep4: '^4.5.6',
      },
    };
    const packageLockJson = {
      dependencies: {
        dep1: { version: '1.2.4' },
        dep3: { version: '3.0.5' },
        dep4: { version: '4.5.6' },
      },
    };
    const mockFiles = {
      'package.json': JSON.stringify(packageJson),
      'package-lock.json': JSON.stringify(packageLockJson),
    };
    fs.setMockFiles(mockFiles);

    const expectedDep1 = buildDepMessage('dep1', '1.2.3', '1.2.4');
    const expectedDep2 = buildDepMessage('dep2', '2.3.4', '');
    const expectedDep3 = buildDepMessage('dep3', '3.4.5', '3.0.5');

    jsOutOfSyncDeps();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringMatching(expectedDep1),
    );
    expect(global.warn).toHaveBeenCalledWith(
      expect.stringMatching(expectedDep2),
    );
    expect(global.warn).toHaveBeenCalledWith(
      expect.stringMatching(expectedDep3),
    );
    expect(global.warn).not.toHaveBeenCalledWith(expect.stringMatching('dep4'));
  });

  it('should warn when devDependencies are out of sync', () => {
    const packageJson = {
      dependencies: {
        dep5: '^5.6.7',
        dep6: '^6.7.8',
        dep7: '^7.8.9',
        dep8: '^8.9.0',
      },
    };
    const packageLockJson = {
      dependencies: {
        dep5: { version: '5.9.9' },
        dep6: { version: '6.9.9' },
        dep7: { version: '7.8.9' },
      },
    };
    const mockFiles = {
      'package.json': JSON.stringify(packageJson),
      'package-lock.json': JSON.stringify(packageLockJson),
    };
    fs.setMockFiles(mockFiles);

    const expectedDep5 = buildDepMessage('dep5', '5.6.7', '5.9.9');
    const expectedDep6 = buildDepMessage('dep6', '6.7.8', '6.9.9');

    jsOutOfSyncDeps();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringMatching(expectedDep5),
    );
    expect(global.warn).toHaveBeenCalledWith(
      expect.stringMatching(expectedDep6),
    );
    expect(global.warn).not.toHaveBeenCalledWith(expect.stringMatching('dep7'));
  });

  it('should warn when dependencies are out of sync in a folder and "path" is provided', () => {
    const packageJson = {
      dependencies: {
        dep1: '~1.2.3',
        dep2: '^2.3.4',
      },
    };
    const packageLockJson = {
      dependencies: {
        dep1: { version: '1.2.4' },
        dep2: { version: '2.3.4' },
      },
    };
    const path = 'folder/';
    const packageFilename = `${path}package.json`;
    const lockFilename = `${path}package-lock.json`;
    const mockFiles = {
      [packageFilename]: JSON.stringify(packageJson),
      [lockFilename]: JSON.stringify(packageLockJson),
    };
    fs.setMockFiles(mockFiles);

    const expectedDep1 = buildDepMessage('dep1', '1.2.3', '1.2.4');

    jsOutOfSyncDeps({ path });

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringMatching(expectedDep1),
    );
    expect(global.warn).not.toHaveBeenCalledWith(expect.stringMatching('dep2'));
  });

  it('should log as "logType" when is provided', () => {
    const packageJson = {
      dependencies: {
        dep1: '~1.2.3',
      },
    };
    const packageLockJson = {
      dependencies: {
        dep1: { version: '9.9.9' },
      },
    };
    const mockFiles = {
      'package.json': JSON.stringify(packageJson),
      'package-lock.json': JSON.stringify(packageLockJson),
    };
    fs.setMockFiles(mockFiles);

    jsOutOfSyncDeps({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
