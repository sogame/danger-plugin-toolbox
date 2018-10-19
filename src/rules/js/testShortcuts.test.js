import * as helpers from '../helpers';
import jsTestShortcuts from './testShortcuts';

const buildMessageSkipped = filename =>
  `The file \`${filename}\` may contain skipped tests.`;

const buildMessageFocused = filename =>
  `The file \`${filename}\` may contain focused ("only") tests.`;

const validJs = 'valid.test.js';
const xdescribe = 'xdescribe.test.js';
const describeSkip = 'describeSkip.test.js';
const xit = 'xit.test.js';
const itSkip = 'itSkip.test.js';
const testSkip = 'testSkip.test.js';
const fdescribe = 'fdescribe.test.js';
const describeOnly = 'describeOnly.test.js';
const fit = 'fit.test.js';
const itOnly = 'itOnly.test.js';
const testOnly = 'testOnly.test.js';
const invalidJsx = 'xdescribe.test.jsx';
const invalidSpec = 'xdescribe.spec.jsx';
const invalidCase = 'xdescribe.test.JS';
const mockFiles = {
  [validJs]: 'it("should ...")',
  [xdescribe]: 'xdescribe("should ...")',
  [describeSkip]: 'describe.skip("should ...")',
  [xit]: 'xit("should ...")',
  [itSkip]: 'it.skip("should ...")',
  [testSkip]: 'test.skip("should ...")',
  [fdescribe]: 'fdescribe("should ...")',
  [describeOnly]: 'describe.only("should ...")',
  [fit]: 'fit("should ...")',
  [itOnly]: 'it.only("should ...")',
  [testOnly]: 'test.only("should ...")',
  [invalidJsx]: 'xdescribe("should ...")',
  [invalidSpec]: 'xdescribe("should ...")',
  [invalidCase]: 'xdescribe("should ...")',
};

helpers.setMockFilesContent(mockFiles);

describe('jsTestShortcuts', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when the file contains no skipped/focused tests', async () => {
    const files = [validJs];
    helpers.setMockCommittedFiles(files);

    await jsTestShortcuts();

    expect(global.warn).not.toHaveBeenCalled();
  });

  describe('Skipped tests', () => {
    it('should warn when any file contains skipped tests (xdescribe)', async () => {
      const files = [validJs, xdescribe];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(xdescribe);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (describe.skip)', async () => {
      const files = [validJs, describeSkip];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(describeSkip);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (xit)', async () => {
      const files = [validJs, xit];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(xit);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (it.skip)', async () => {
      const files = [validJs, itSkip];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(itSkip);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (test.skip)', async () => {
      const files = [validJs, testSkip];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(testSkip);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });
  });

  describe('Focused tests', () => {
    it('should warn when any file contains skipped tests (fdescribe)', async () => {
      const files = [validJs, fdescribe];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageFocused(fdescribe);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (describe.only)', async () => {
      const files = [validJs, describeOnly];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageFocused(describeOnly);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (fit)', async () => {
      const files = [validJs, fit];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageFocused(fit);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (it.only)', async () => {
      const files = [validJs, itOnly];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageFocused(itOnly);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should warn when any file contains skipped tests (test.only)', async () => {
      const files = [validJs, testOnly];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageFocused(testOnly);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });
  });

  it('should ignore file extension casing', async () => {
    const files = [invalidCase];
    helpers.setMockCommittedFiles(files);

    await jsTestShortcuts();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidCase),
    );
  });

  it('should log as "logTypeSkipped" when is provided', async () => {
    const files = [validJs, xdescribe];
    helpers.setMockCommittedFiles(files);

    await jsTestShortcuts({ logTypeSkipped: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypeFocused" when is provided', async () => {
    const files = [validJs, fdescribe];
    helpers.setMockCommittedFiles(files);

    await jsTestShortcuts({ logTypeFocused: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log each message accordingly when "logTypeSkipped" and "logTypeFocused" are provided', async () => {
    const files = [validJs, xdescribe, fdescribe];
    helpers.setMockCommittedFiles(files);

    await jsTestShortcuts({
      logTypeSkipped: 'message',
      logTypeFocused: 'fail',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalledWith(buildMessageSkipped(xdescribe));
    expect(global.fail).toHaveBeenCalledWith(buildMessageFocused(fdescribe));
  });
});
