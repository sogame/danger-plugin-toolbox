import fs from 'fs';

import commonFileExists from '../fileExists';

const existingFile1 = 'file1.txt';
const existingFile2 = 'file2.txt';
const nonExistingFile1 = 'nonExisting1.txt';
const nonExistingFile2 = 'nonExisting2.txt';
const mockFiles = {
  [existingFile1]: 'foo',
  [existingFile2]: 'bar',
};

fs.setMockFiles(mockFiles);

const buildDefaultMessage = filename =>
  `The file \`${filename}\` is required but it was not found. Please, commit it.`;

const buildCustomMessage = filename => `Custom message: \`${filename}\`.`;

describe('commonFileExists', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when the file exists (string)', () => {
    commonFileExists(existingFile1);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when the file exists (array)', () => {
    commonFileExists([existingFile1]);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when all files exists', () => {
    commonFileExists([existingFile1, existingFile2]);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when the file does not exist (string)', () => {
    commonFileExists(nonExistingFile1);

    const message = buildDefaultMessage(nonExistingFile1);

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should warn when the file does not exist (array)', () => {
    commonFileExists([nonExistingFile1]);

    const message = buildDefaultMessage(nonExistingFile1);

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should warn multiple times when multiple files do not exist', () => {
    commonFileExists([nonExistingFile1, existingFile1, nonExistingFile2]);

    const message1 = buildDefaultMessage(nonExistingFile1);
    const message2 = buildDefaultMessage(nonExistingFile2);

    expect(global.warn).toHaveBeenCalledTimes(2);
    expect(global.warn).toHaveBeenCalledWith(message1);
    expect(global.warn).toHaveBeenCalledWith(message2);
  });

  it('should allow modifying the message', () => {
    commonFileExists(nonExistingFile1, { buildMessage: buildCustomMessage });

    const message = buildCustomMessage(nonExistingFile1);

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should log as "logType" when is provided', () => {
    commonFileExists(nonExistingFile1, { logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should show a warning when the "files" parameter is missing', () => {
    commonFileExists();

    const message = '`commonFileExists`: missing "files" parameter';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should show a warning when the "files" is invalid', () => {
    commonFileExists(42);

    const message =
      '`commonFileExists`: invalid "files" parameter (string or array expected)';

    expect(global.warn).toHaveBeenCalledWith(message);
  });
});
