import * as helpers from '../helpers';
import jsLocalEslintChange from './localEslintChange';

const validJs = 'valid.js';
const invalidJs = 'invalid.js';
const invalidJsCase = 'invalid.Js';
const invalidJsx = 'invalid.jsx';
const mockFiles = {
  [validJs]: 'const foo = 42;',
  [invalidJs]: 'eslint-disable-line foo',
  [invalidJsCase]: 'eslint-disable foo',
  [invalidJsx]: 'eslint-disable-next-line foo',
};

helpers.setMockFilesContent(mockFiles);

describe('jsLocalEslintChange', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when no eslint rule has been disabled', async () => {
    const files = [validJs];
    helpers.setMockCommittedFiles(files);

    await jsLocalEslintChange();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when some eslint rule has been disabled (js)', async () => {
    const files = [validJs, invalidJs];
    helpers.setMockCommittedFiles(files);

    await jsLocalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidJs),
    );
  });

  it('should warn when some eslint rule has been disabled (jsx)', async () => {
    const files = [validJs, invalidJsx];
    helpers.setMockCommittedFiles(files);

    await jsLocalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidJsx),
    );
  });

  it('should ignore file extension casing', async () => {
    const files = [invalidJsCase];
    helpers.setMockCommittedFiles(files);

    await jsLocalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidJsCase),
    );
  });

  it('should log as "logType" when is provided', async () => {
    const files = [invalidJs];
    helpers.setMockCommittedFiles(files);

    await jsLocalEslintChange({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
