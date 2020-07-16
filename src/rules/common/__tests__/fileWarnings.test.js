import fs from 'fs';

import commonFileWarnings from '../fileWarnings';

const noWarnings = 'noWarnings.log';
const singleWarning = 'singleWarning.log';
const multipleWarnings = 'multipleWarnings.log';
const singleWarningCase = 'singleWarning.LOg';
const warningColon = 'warningColon.log';
const warningQuote = 'warningQuote.log';
const multipleWarningsAllIgnored = 'multipleWarningsAllIgnored.log';
const multipleWarningsSomeIgnored = 'multipleWarningsSomeIgnored.log';
const missingFile = 'someMissingFile.log';
const mockFiles = {
  [noWarnings]: 'some content but no warnings', // should not fail, as the word is "warnings", not "warning"
  [singleWarning]: 'foo\n[[warning ]]\nbar',
  [multipleWarnings]: 'foo\n[[warning 1]]\nbar\n[[warning 2]]',
  [singleWarningCase]: 'foo\n[[warning ]]\nbar',
  [warningColon]: 'foo\n[[warning:]]\nbar',
  [warningQuote]: 'foo\n[[warning"]]\nbar',
  [multipleWarningsAllIgnored]:
    'foo\n[[warning 1]] TO IGNORE\nbar\n[[warning 2]] TO IGNORE',
  [multipleWarningsSomeIgnored]:
    'foo\n[[warning 1]] TO IGNORE\nbar\n[[warning 2]]',
};

fs.setMockFiles(mockFiles);

describe('commonFileWarnings', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when there are no lines containing "warning "', () => {
    commonFileWarnings(noWarnings);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when there is a line containing "warning "', () => {
    commonFileWarnings(singleWarning);

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining('- `[[warning ]]`'),
    );
  });

  it('should warn when there are multiple lines containing "warning "', () => {
    commonFileWarnings(multipleWarnings);

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining('- `[[warning 1]]`'),
    );
    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining('- `[[warning 2]]`'),
    );
  });

  it('should warn when there is a line containing "warning:"', () => {
    commonFileWarnings(warningColon);

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining('- `[[warning:]]`'),
    );
  });

  it(`should not warn when there is a line containing 'warning"'`, () => {
    commonFileWarnings(warningQuote);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when the lines also match "ignoreRegex"', () => {
    commonFileWarnings(multipleWarningsAllIgnored, {
      ignoreRegex: /TO IGNORE/,
    });

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn only for the lines that do not match "ignoreRegex"', () => {
    commonFileWarnings(multipleWarningsSomeIgnored, {
      ignoreRegex: /TO IGNORE/,
    });

    expect(global.warn).toHaveBeenCalledWith(
      expect.not.stringContaining('- `[[warning 1]]`'),
    );
    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining('- `[[warning 2]]`'),
    );
  });

  it('should warn when the file does not exist', () => {
    commonFileWarnings(missingFile);

    expect(global.warn).toHaveBeenCalledWith(
      `\`commonFileWarnings\`: file \`${missingFile}\` does not exist`,
    );
  });

  it('should not warn when the file does not exist but "ignoreNonExistingFile" is set to "true"', () => {
    commonFileWarnings(missingFile, { ignoreNonExistingFile: true });

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should ignore file extension casing', () => {
    commonFileWarnings(singleWarningCase);

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining('- `[[warning ]]`'),
    );
  });

  it('should log as "logType" when is provided', () => {
    commonFileWarnings(singleWarning, { logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should use the defined message when is provided', () => {
    const expectedMsg = 'Expected message';

    commonFileWarnings(singleWarning, { msg: expectedMsg });

    expect(global.warn).toHaveBeenCalledWith(
      `${expectedMsg}<br>- \`[[warning ]]\``,
    );
  });

  it('should show a warning when the "file" parameter is missing', () => {
    commonFileWarnings();

    const message = '`commonFileWarnings`: missing "file" parameter';

    expect(global.warn).toHaveBeenCalledWith(message);
  });
});
