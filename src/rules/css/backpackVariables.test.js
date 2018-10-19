import * as helpers from '../helpers';
import cssBackpackVariables from './backpackVariables';

const validScss = 'valid.scss';
const invalidScss = 'invalid.scss';
const invalidScssCase = 'invalid.sCSs';
const mockFiles = {
  [validScss]: 'padding: $bpk-spacing-sm;',
  [invalidScss]: 'padding: 3rem;',
  [invalidScssCase]: 'padding: 3rem;',
};

helpers.setMockFilesContent(mockFiles);

describe('cssBackpackVariables', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when there are no files', async () => {
    const files = [];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when all files are valid', async () => {
    const files = [validScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when any file is invalid', async () => {
    const files = [validScss, invalidScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidScss),
    );
  });

  it('should ignore file extension casing', async () => {
    const files = [validScss, invalidScssCase];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidScssCase),
    );
  });

  it('should log as "logType" when is provided', async () => {
    const files = [invalidScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
