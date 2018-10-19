import * as helpers from '../helpers';
import cssLocalStylelintChange from './localStylelintChange';

const validScss = 'valid.scss';
const invalidScss = 'invalid.scss';
const invalidScssCase = 'invalid.sCSs';
const invalidCss = 'invalid.css';
const mockFiles = {
  [validScss]: 'padding: 3rem;',
  [invalidScss]: 'stylelint-disable-line foo',
  [invalidScssCase]: 'stylelint-disable foo',
  [invalidCss]: 'stylelint-disable-next-line foo',
};

helpers.setMockFilesContent(mockFiles);

describe('cssLocalStylelintChange', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when no stylelint rule has been disabled', async () => {
    const files = [validScss];
    helpers.setMockCommittedFiles(files);

    await cssLocalStylelintChange();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when some stylelint rule has been disabled (scss)', async () => {
    const files = [validScss, invalidScss];
    helpers.setMockCommittedFiles(files);

    await cssLocalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidScss),
    );
  });

  it('should warn when some stylelint rule has been disabled (css)', async () => {
    const files = [validScss, invalidCss];
    helpers.setMockCommittedFiles(files);

    await cssLocalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidCss),
    );
  });

  it('should ignore file extension casing', async () => {
    const files = [invalidScssCase];
    helpers.setMockCommittedFiles(files);

    await cssLocalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidScssCase),
    );
  });

  it('should log as "logType" when is provided', async () => {
    const files = [invalidScss];
    helpers.setMockCommittedFiles(files);

    await cssLocalStylelintChange({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
