import * as helpers from '../../helpers';
import inlineLogMatching from '../../inlineLogMatching';
import jsTestShortcuts from '../testShortcuts';

jest.mock('../../inlineLogMatching');

const buildMessageSkipped = (filename) =>
  `The file \`${filename}\` may contain skipped tests.`;

const buildMessageFocused = (filename) =>
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
const validFit = 'valitFit.test.js';
const itOnly = 'itOnly.test.js';
const testOnly = 'testOnly.test.js';
const invalidJsx = 'xdescribe.test.jsx';
const invalidTs = 'xdescribe.test.ts';
const invalidTsx = 'xdescribe.test.tsx';
const invalidSpec = 'xdescribe.spec.jsx';
const invalidCase = 'xdescribe.test.JS';
const noFunctionCall = 'noFunctionCall.test.ts';
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
  [validFit]: 'doesNotFit("should ...")',
  [itOnly]: 'it.only("should ...")',
  [testOnly]: 'test.only("should ...")',
  [invalidJsx]: 'xdescribe("should ...")',
  [invalidTs]: 'xdescribe("should ...")',
  [invalidTsx]: 'xdescribe("should ...")',
  [invalidSpec]: 'xdescribe("should ...")',
  [invalidCase]: 'xdescribe("should ...")',
  [noFunctionCall]: 'xdescribe foo',
};

helpers.setMockFilesContent(mockFiles);

describe('jsTestShortcuts', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  describe('not inline', () => {
    afterEach(() => {
      expect(inlineLogMatching).not.toHaveBeenCalled();
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

      it('should not warn for function names end with "fit"', async () => {
        const files = [validJs, validFit];
        helpers.setMockCommittedFiles(files);

        const expectedMsg = buildMessageFocused(validFit);

        await jsTestShortcuts();

        expect(global.warn).not.toHaveBeenCalledWith(expectedMsg);
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

    it('should support jsx files', async () => {
      const files = [validJs, invalidJsx];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(invalidJsx);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should support ts files', async () => {
      const files = [validJs, invalidTs];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(invalidTs);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should support tsx files', async () => {
      const files = [validJs, invalidTsx];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessageSkipped(invalidTsx);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should ignore file extension casing', async () => {
      const files = [invalidCase];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts();

      expect(global.warn).toHaveBeenCalledWith(
        expect.stringContaining(invalidCase),
      );
    });

    it('should not warn when it is not a function call', async () => {
      const files = [noFunctionCall];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts();

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should log as "logTypeSkipped" when is provided', async () => {
      const files = [validJs, xdescribe];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts({ logTypeSkipped: 'fail' });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).toHaveBeenCalled();
    });

    it('should log as "logTypeSkipped" when "logType" is also provided', async () => {
      const files = [validJs, xdescribe];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts({
        logTypeSkipped: 'fail',
        logType: 'message',
      });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.message).not.toHaveBeenCalled();
      expect(global.fail).toHaveBeenCalled();
    });

    it('should log as "logTypeFocused" when is provided', async () => {
      const files = [validJs, fdescribe];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts({ logTypeFocused: 'fail' });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).toHaveBeenCalled();
    });

    it('should log as "logTypeFocused" when "logType" is also provided', async () => {
      const files = [validJs, fdescribe];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts({
        logTypeFocused: 'fail',
        logType: 'message',
      });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.message).not.toHaveBeenCalled();
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
      expect(global.message).toHaveBeenCalledWith(
        buildMessageSkipped(xdescribe),
      );
      expect(global.fail).toHaveBeenCalledWith(buildMessageFocused(fdescribe));
    });

    it('should log as "logType" when provided but "logTypeSkipped" is not', async () => {
      const files = [validJs, xdescribe];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts({ logType: 'fail' });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).toHaveBeenCalled();
    });

    it('should log as "logType" when provided but "logTypeFocused" is not', async () => {
      const files = [validJs, fdescribe];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts({ logType: 'fail' });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).toHaveBeenCalled();
    });
  });

  describe('inline', () => {
    it('should call "inlineLogMatching"', async () => {
      const files = [xdescribe];
      helpers.setMockCommittedFiles(files);

      await jsTestShortcuts({ inline: true });

      expect(inlineLogMatching).toHaveBeenCalledTimes(2);
      expect(global.message).not.toHaveBeenCalled();
      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).not.toHaveBeenCalled();
    });
  });
});
