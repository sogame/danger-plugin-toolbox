import fs from 'fs';

import commonFileWarnings from '../fileWarnings';

const noWarnings = 'noWarnings.log';
const singleWarning = 'singleWarning.log';
const multipleWarnings = 'multipleWarnings.log';
const singleWarningCase = 'singleWarning.LOg';
const mockFiles = {
  [noWarnings]: 'some content but no warnings', // should not fail, as the word is "warnings", not "warning"
  [singleWarning]: 'foo\n[[warning]]\nbar',
  [multipleWarnings]: 'foo\n[[warning 1]]\nbar\n[[warning 2]]',
  [singleWarningCase]: 'foo\n[[warning]]\nbar',
};

fs.setMockFiles(mockFiles);

describe('commonFileWarnings', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when there are no lines containing "warning"', () => {
    commonFileWarnings(noWarnings);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when there is a line containing "warning"', () => {
    commonFileWarnings(singleWarning);

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(`- [[warning]]`),
    );
  });

  it('should warn when there are multiple lines containing "warning"', () => {
    commonFileWarnings(multipleWarnings);

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(`- [[warning 1]]`),
    );
    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(`- [[warning 2]]`),
    );
  });

  it('should ignore file extension casing', () => {
    commonFileWarnings(singleWarningCase);

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(`- [[warning]]`),
    );
  });

  it('should log as "logType" when is provided', () => {
    commonFileWarnings(singleWarning, { logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should show a warning when the "file" parameter is missing', () => {
    commonFileWarnings();

    const message = '`commonFileWarnings`: missing "file" parameter';

    expect(global.warn).toHaveBeenCalledWith(message);
  });
});
