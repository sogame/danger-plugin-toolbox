import * as helpers from '../../helpers';
import inlineLogMatching from '../../inlineLogMatching';
import jsLocalEslintChange from '../localEslintChange';

jest.mock('../../inlineLogMatching');

const validJs = 'valid.js';
const invalidJs = 'invalid.js';
const invalidJsCase = 'invalid.Js';
const invalidJsx = 'invalid.jsx';
const invalidTs = 'invalid.ts';
const mockFiles = {
  [validJs]: 'const foo = 42;',
  [invalidJs]: 'eslint-disable-line foo',
  [invalidJsCase]: 'eslint-disable foo',
  [invalidJsx]: 'eslint-disable-next-line foo',
  [invalidTs]: 'eslint-disable-line foo',
};

helpers.setMockFilesContent(mockFiles);

describe('jsLocalEslintChange', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  describe('not inline', () => {
    afterEach(() => {
      // eslint-disable-next-line jest/no-standalone-expect
      expect(inlineLogMatching).not.toHaveBeenCalled();
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

    it('should warn when some eslint rule has been disabled (ts)', async () => {
      const files = [validJs, invalidTs];
      helpers.setMockCommittedFiles(files);

      await jsLocalEslintChange();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidTs),
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

  describe('inline', () => {
    it('should call "inlineLogMatching"', async () => {
      const files = [invalidJs];
      helpers.setMockCommittedFiles(files);

      await jsLocalEslintChange({ inline: true });

      expect(inlineLogMatching).toHaveBeenCalledTimes(1);
      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).not.toHaveBeenCalled();
    });
  });
});
