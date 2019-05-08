import * as helpers from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const filename = 'file.js';
const msg = 'Inline message';
const logSpy = jest.fn();
const structuredAddedLines = {
  1: 'line 1',
  2: 'line 2',
  7: 'line 7',
  10: 'line 10',
};

helpers.setFilesStructuredAddedLines({ [filename]: structuredAddedLines });

describe('inlineLogMatching', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not call "log" function when there are no matches', async () => {
    const regex = /not found/;

    await inlineLogMatching(filename, regex, msg, logSpy);

    expect(logSpy).not.toHaveBeenCalled();
  });

  it('should call "log" function when there are matches', async () => {
    const regex = /line 1/;

    await inlineLogMatching(filename, regex, msg, logSpy);

    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(1, msg, filename, 1);
    expect(logSpy).toHaveBeenNthCalledWith(2, msg, filename, 10);
  });
});
