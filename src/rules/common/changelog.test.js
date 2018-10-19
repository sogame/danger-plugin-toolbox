import * as helpers from '../helpers';
import commonChangelog from './changelog';

const buildMessage = filename => `\`${filename}\` has not been updated.`;

describe('commonChangelog', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should warn when not changed and not trivial', () => {
    const files = ['file.js'];
    helpers.setMockCommittedFiles(files);
    helpers.isTrivial = false;

    const expectedMsg = buildMessage('CHANGELOG.md');

    commonChangelog();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should not warn when not changed and trivial', () => {
    const files = ['file.js'];
    helpers.setMockCommittedFiles(files);
    helpers.isTrivial = true;

    commonChangelog();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when changed and trivial', () => {
    const files = ['file.js', 'CHANGELOG.md'];
    helpers.setMockCommittedFiles(files);
    helpers.isTrivial = true;

    commonChangelog();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when changed and not trivial', () => {
    const files = ['file.js', 'CHANGELOG.md'];
    helpers.setMockCommittedFiles(files);
    helpers.isTrivial = false;

    commonChangelog();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when modifying the contributing filename and it has not been changed', () => {
    const newFilename = 'newFilename.md';

    const files = ['file.js', 'CHANGELOG.md'];
    helpers.setMockCommittedFiles(files);
    helpers.isTrivial = false;

    const expectedMsg = buildMessage(newFilename);

    commonChangelog({ changelogFile: newFilename });

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should warn when modifying the contributing filename and it has been changed', () => {
    const newFilename = 'newFilename.md';

    const files = ['file.js', newFilename];
    helpers.setMockCommittedFiles(files);
    helpers.isTrivial = false;

    commonChangelog({ changelogFile: newFilename });

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should log as "logType" when is provided', () => {
    const files = ['file.js'];
    helpers.setMockCommittedFiles(files);
    helpers.isTrivial = false;

    commonChangelog({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
