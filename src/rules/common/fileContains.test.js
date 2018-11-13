import fs from 'fs';

import * as helpers from '../helpers';
import commonFileContains from './fileContains';

const fileFoo = 'fileFoo.txt';
const fileBar = 'fileBar.txt';
const mockFiles = {
  [fileFoo]: 'lorem\nipsum foo lorem\nipsum',
  [fileBar]: 'lorem\nipsum bar lorem\nipsum',
};

fs.setMockFiles(mockFiles);

const buildRegularMessage = (filename, regex) =>
  `The file \`${filename}\` does not match \`${regex}\`.`;

const builReverseMessage = (filename, regex) =>
  `The file \`${filename}\` matches \`${regex}\`.`;

const buildCustomMessage = (filename, regex) =>
  `Custom message: \`${filename}\`, \`${regex}\`.`;

describe('commonFileContains', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  describe('Regular match', () => {
    it('should not warn when the file contents match the regex', () => {
      const file = fileFoo;
      helpers.setMockCommittedFiles([file]);

      commonFileContains(file, /foo/);

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should warn when the file contents do not match the regex', () => {
      const file = fileBar;
      const regex = /foo/;
      const expectedMsg = buildRegularMessage(file, regex);
      helpers.setMockCommittedFiles([file]);

      commonFileContains(file, regex);

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });
  });

  describe('Reverse match', () => {
    it('should warn when the file contents match the regex', () => {
      const file = fileFoo;
      const regex = /foo/;
      const expectedMsg = builReverseMessage(file, regex);
      helpers.setMockCommittedFiles([file]);

      commonFileContains(file, regex, { reverse: true });

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should not warn when the file contents do not match the regex', () => {
      const file = fileBar;
      const regex = /foo/;
      helpers.setMockCommittedFiles([file]);

      commonFileContains(file, regex, { reverse: true });

      expect(global.warn).not.toHaveBeenCalled();
    });
  });

  it('should not warn when the file contents do not match the regex but the file has not been committed', () => {
    const file = fileBar;
    const regex = /foo/;
    helpers.setMockCommittedFiles([]);

    commonFileContains(file, regex);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should allow modifying the message', () => {
    const file = fileBar;
    const regex = /foo/;
    const expectedMsg = buildCustomMessage(file, regex);
    helpers.setMockCommittedFiles([file]);

    commonFileContains(file, regex, { buildMessage: buildCustomMessage });

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should log as "logType" when is provided', () => {
    const file = fileBar;
    const regex = /foo/;
    helpers.setMockCommittedFiles([file]);

    commonFileContains(file, regex, { logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should show a warning when the "file" parameter is missing', () => {
    commonFileContains();

    const message = '`commonFileContains`: missing "file" parameter';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should show a warning when the "regex" parameter is missing', () => {
    commonFileContains('file.txt');

    const message = '`commonFileContains`: missing "regex" parameter';

    expect(global.warn).toHaveBeenCalledWith(message);
  });
});
