import * as helpers from '../../helpers';
import jsRecommendAsyncAwait from '../recommendAsyncAwait';

const noPromisesJs = 'noPromises.js';
const promiseAllJs = 'promiseAll.js';
const promiseResolveJs = 'promiseResolve.js';
const newPromiseJs = 'newPromis.js';
const dotThenJs = 'dotThen.js';
const dotCatchJs = 'dotCatch.js';
const invalidJsCase = 'invalid.Js';
const invalidJsx = 'invalid.js';
const invalidTs = 'invalid.js';
const mockFiles = {
  [noPromisesJs]: 'const foo = 42;',
  [promiseAllJs]: 'foo Promise.all bar',
  [promiseResolveJs]: 'foo Promise.resolve bar',
  [newPromiseJs]: 'foo new Promise() bar',
  [dotThenJs]: 'foo .then( bar',
  [dotCatchJs]: 'foo .catch( bar',
  [invalidJsCase]: 'foo new Promise() bar',
  [invalidJsx]: 'foo new Promise() bar',
  [invalidTs]: 'foo new Promise() bar',
};

helpers.setMockFilesContent(mockFiles);

describe('jsRecommendAsyncAwait', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
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

  it('should log as "logType" when is provided', async () => {
    const files = [newPromiseJs];
    helpers.setMockCommittedFiles(files);

    await jsRecommendAsyncAwait({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
