import * as helpers from '../../helpers';
import inlineLogMatching from '../../inlineLogMatching';
import jsRecommendAsyncAwait from '../recommendAsyncAwait';

jest.mock('../../inlineLogMatching');

const contentWithNewPromise = 'foo new Promise() bar';

const noPromisesJs = 'noPromises.js';
const promiseAllJs = 'promiseAll.js';
const promiseResolveJs = 'promiseResolve.js';
const newPromiseJs = 'newPromis.js';
const dotThenJs = 'dotThen.js';
const dotCatchJs = 'dotCatch.js';
const invalidJsCase = 'invalid.Js';
const invalidJsx = 'invalid.jsx';
const invalidTs = 'invalid.js';
const invalidJsxTest = 'invalid.test.jsx';
const invalidMockFolder = 'foo/__mocks__/invalid.test.jsx';
const invalidMockRoot = '__mocks__/invalid.test.jsx';
const mockFiles = {
  [noPromisesJs]: 'const foo = 42;',
  [promiseAllJs]: 'foo Promise.all bar',
  [promiseResolveJs]: 'foo Promise.resolve bar',
  [newPromiseJs]: contentWithNewPromise,
  [dotThenJs]: 'foo .then( bar',
  [dotCatchJs]: 'foo .catch( bar',
  [invalidJsCase]: contentWithNewPromise,
  [invalidJsx]: contentWithNewPromise,
  [invalidTs]: contentWithNewPromise,
  [invalidJsxTest]: contentWithNewPromise,
  [invalidMockFolder]: contentWithNewPromise,
  [invalidMockRoot]: contentWithNewPromise,
};

helpers.setMockFilesContent(mockFiles);

describe('jsRecommendAsyncAwait', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  describe('not inline', () => {
    afterEach(() => {
      expect(inlineLogMatching).not.toHaveBeenCalled();
    });

    it('should not warn when file does not use promises', async () => {
      const files = [noPromisesJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should not warn when file uses "Promise.all"', async () => {
      const files = [promiseAllJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should warn when some file uses a promise method (like "Promise.resolve")', async () => {
      const files = [noPromisesJs, promiseResolveJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(promiseResolveJs),
      );
    });

    it('should warn when some file uses "new Promise()")', async () => {
      const files = [noPromisesJs, newPromiseJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(newPromiseJs),
      );
    });

    it('should warn when some file uses ".then()")', async () => {
      const files = [noPromisesJs, dotThenJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(dotThenJs),
      );
    });

    it('should warn when some file uses ".catch()")', async () => {
      const files = [noPromisesJs, dotCatchJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(dotCatchJs),
      );
    });

    it('should warn when promises are used (jsx)', async () => {
      const files = [noPromisesJs, invalidJsx];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidJsx),
      );
    });

    it('should warn when promises are used (ts)', async () => {
      const files = [noPromisesJs, invalidTs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidTs),
      );
    });

    it('should ignore file extension casing', async () => {
      const files = [invalidJsCase];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidJsCase),
      );
    });

    it('should warn when promises are used in a test file', async () => {
      const files = [noPromisesJs, invalidJsxTest];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidJsxTest),
      );
    });

    it('should warn when promises are used in a mock file (in a folder)', async () => {
      const files = [noPromisesJs, invalidMockFolder];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidMockFolder),
      );
    });

    it('should warn when promises are used in a mock file (root folder)', async () => {
      const files = [noPromisesJs, invalidMockRoot];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidMockRoot),
      );
    });

    it('should not warn when promises are used in a test file and "ignoreTests" is set', async () => {
      const files = [noPromisesJs, invalidJsxTest];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait({ ignoreTests: true });

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should not warn when promises are used in a mock file (in a folder) and "ignoreTests" is set', async () => {
      const files = [noPromisesJs, invalidMockFolder];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait({ ignoreTests: true });

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should not warn when promises are used in a mock file (root folder) and "ignoreTests" is set', async () => {
      const files = [noPromisesJs, invalidMockRoot];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait({ ignoreTests: true });

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should log as "logType" when is provided', async () => {
      const files = [newPromiseJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait({ logType: 'fail' });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).toHaveBeenCalled();
    });
  });

  describe('inline', () => {
    it('should call "inlineLogMatching"', async () => {
      const files = [promiseResolveJs];
      helpers.setMockCommittedFiles(files);

      await jsRecommendAsyncAwait({ inline: true });

      expect(inlineLogMatching).toHaveBeenCalledTimes(1);
      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).not.toHaveBeenCalled();
    });
  });
});
