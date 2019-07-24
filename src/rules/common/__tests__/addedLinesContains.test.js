import * as helpers from '../../helpers';
import inlineLogMatching from '../../inlineLogMatching';
import commonAddedLinesContains from '../addedLinesContains';

jest.mock('../../inlineLogMatching');

const buildMessage = filename =>
  `Some added lines in \`${filename}\` match the provided regex.`;

const validJs = 'valid.js';
const invalidJs = 'invalid.js';
const mockFiles = {
  [validJs]: 'const foo = 42;',
  [invalidJs]: 'const bar = 41;',
};

helpers.setMockFilesContent(mockFiles);

describe('commonAddedLinesContains', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  describe('not inline', () => {
    afterEach(() => {
      expect(inlineLogMatching).not.toHaveBeenCalled();
    });

    it('should not warn when no new lines match the regex', async () => {
      const files = [validJs];
      helpers.setMockCommittedFiles(files);

      const filesRegex = validJs;
      const lineRegex = 'bar';
      await commonAddedLinesContains(filesRegex, lineRegex, buildMessage);

      expect(global.warn).not.toHaveBeenCalled();
    });

    it('should warn when new lines match the regex', async () => {
      const files = [invalidJs];
      helpers.setMockCommittedFiles(files);

      const expectedMsg = buildMessage(invalidJs);

      const filesRegex = invalidJs;
      const lineRegex = 'bar';

      await commonAddedLinesContains(filesRegex, lineRegex, buildMessage);

      expect(global.warn).toHaveBeenCalledWith(expectedMsg);
    });

    it('should log as "logType" when is provided', async () => {
      const files = [invalidJs];
      helpers.setMockCommittedFiles(files);

      const filesRegex = invalidJs;
      const lineRegex = 'bar';

      await commonAddedLinesContains(filesRegex, lineRegex, buildMessage, {
        logType: 'fail',
      });

      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).toHaveBeenCalled();
    });
  });

  describe('inline', () => {
    it('should call "inlineLogMatching"', async () => {
      const files = [invalidJs];
      helpers.setMockCommittedFiles(files);

      const filesRegex = invalidJs;
      const lineRegex = 'bar';

      await commonAddedLinesContains(filesRegex, lineRegex, buildMessage, {
        inline: true,
      });

      expect(inlineLogMatching).toHaveBeenCalledTimes(1);
      expect(global.warn).not.toHaveBeenCalled();
      expect(global.fail).not.toHaveBeenCalled();
    });
  });

  it('should show a warning when the "filesRegex" parameter is missing', () => {
    commonAddedLinesContains();

    const message =
      '`commonAddedLinesContains`: missing "filesRegex" parameter.';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should show a warning when the "lineRegex" parameter is missing', () => {
    commonAddedLinesContains('filesRegex');

    const message =
      '`commonAddedLinesContains`: missing "lineRegex" parameter.';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should show a warning when the "buildMessage" parameter is missing', () => {
    commonAddedLinesContains('filesRegex', 'lineRegex');

    const message =
      '`commonAddedLinesContains`: missing "buildMessage" parameter.';

    expect(global.warn).toHaveBeenCalledWith(message);
  });
});
