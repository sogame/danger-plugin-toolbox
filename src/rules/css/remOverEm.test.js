import * as helpers from '../helpers';
import cssRemOverEm from './remOverEm';

const validScss = 'valid.scss';
const invalidScss = 'invalid.scss';
const invalidScssCase = 'invalid.ScsS';
const invalidCss = 'invalid.css';
const mockFiles = {
  [validScss]: 'padding: 3rem;',
  [invalidScss]: 'padding: 3em;',
  [invalidScssCase]: 'padding: 3em;',
  [invalidCss]: 'padding: 3em;',
};

helpers.setMockFilesContent(mockFiles);

describe('cssRemOverEm', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when using "rem"', async () => {
    const files = [validScss];
    helpers.setMockCommittedFiles(files);

    await cssRemOverEm();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when using "em" (scss)', async () => {
    const files = [validScss, invalidScss];
    helpers.setMockCommittedFiles(files);

    await cssRemOverEm();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidScss),
    );
  });

  it('should warn when using "em" (css)', async () => {
    const files = [validScss, invalidCss];
    helpers.setMockCommittedFiles(files);

    await cssRemOverEm();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidCss),
    );
  });

  it('should ignore file extension casing', async () => {
    const files = [validScss, invalidScssCase];
    helpers.setMockCommittedFiles(files);

    await cssRemOverEm();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidScssCase),
    );
  });

  it('should log as "logType" when is provided', async () => {
    const files = [invalidScss];
    helpers.setMockCommittedFiles(files);

    await cssRemOverEm({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
