import fs from 'fs';

import * as helpers from '../helpers';
import commonValidJson from './validJson';

const validJson = 'valid.json';
const invalidJson = 'invalid.json';
const invalidJsonCase = 'invalid.jSoN';
const mockFiles = {
  [validJson]: '{"foo": "bar", "num": 42}',
  [invalidJson]: '{"foo": }',
  [invalidJsonCase]: '{"foo": }',
};

fs.setMockFiles(mockFiles);

const buildMessage = (filename, msg) =>
  `\`${filename}\` is not a valid JSON file: \`${msg}\`.`;

describe('commonValidJson', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when there are no files', () => {
    const files = [];
    helpers.setMockCommittedFiles(files);

    commonValidJson();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when all files are valid', () => {
    const files = [validJson];
    helpers.setMockCommittedFiles(files);

    commonValidJson();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when any file is invalid', () => {
    const files = [validJson, invalidJson];
    helpers.setMockCommittedFiles(files);

    const exception = 'SyntaxError: Unexpected token } in JSON at position 8';
    const expectedMsg = buildMessage(invalidJson, exception);

    commonValidJson();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should ignore file extension casing', () => {
    const files = [validJson, invalidJsonCase];
    helpers.setMockCommittedFiles(files);

    const exception = 'SyntaxError: Unexpected token } in JSON at position 8';
    const expectedMsg = buildMessage(invalidJsonCase, exception);

    commonValidJson();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should log as "logType" when is provided', () => {
    const files = [invalidJson];
    helpers.setMockCommittedFiles(files);

    commonValidJson({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
