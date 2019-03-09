import * as helpers from '../helpers';

import cssBackpackVariables from './backpackVariables';

const buildMessageUnits = filename =>
  `The file \`${filename}\` seems to be using non-[Backapack](https://backpack.github.io/) units (\`rem\`, \`em\`, \`px\`). [Backpack units](https://backpack.github.io/tokens/) (or whole multiples of them, like \`3 * $bpk-spacing-xs\`) should be used instead.`;

const buildMessagePixel = filename =>
  `The file \`${filename}\` seems to be using \`$bpk-one-pixel-rem\`. This can hide the usage of \`px\` instead of [Backapack](https://backpack.github.io/) units. Make sure using \`px\` is strictly needed.`;

const validScss = 'valid.scss';
const invalidUnitsScss = 'invalidUnits.scss';
const invalidUnitsScssCase = 'invalidUnits.sCSs';
const invalidPixelScss = 'invalidPixel.scss';
const invalidPixelScssCase = 'invalidPixel.sCSs';
const mockFiles = {
  [validScss]: 'padding: $bpk-spacing-sm;',
  [invalidUnitsScss]: 'padding: 3rem;',
  [invalidUnitsScssCase]: 'padding: 3rem;',
  [invalidPixelScss]: 'padding: 123 * $bpk-one-pixel-rem;',
  [invalidPixelScssCase]: 'padding: 123 * $bpk-one-pixel-rem;',
};

helpers.setMockFilesContent(mockFiles);

describe('cssBackpackVariables', () => {
  beforeEach(() => {
    global.message = jest.fn();
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

  it('should warn when any file contains non-Backpack units', async () => {
    const files = [validScss, invalidUnitsScss];
    helpers.setMockCommittedFiles(files);

    const expectedMsg = buildMessageUnits(invalidUnitsScss);

    await cssBackpackVariables();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should warn when any file contains $bpk-one-pixel-rem', async () => {
    const files = [validScss, invalidPixelScss];
    helpers.setMockCommittedFiles(files);

    const expectedMsg = buildMessagePixel(invalidPixelScss);

    await cssBackpackVariables();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should ignore file extension casing', async () => {
    const files = [validScss, invalidUnitsScssCase, invalidPixelScssCase];
    helpers.setMockCommittedFiles(files);

    const expectedMsgUnits = buildMessageUnits(invalidUnitsScssCase);
    const expectedMsgPixel = buildMessagePixel(invalidPixelScssCase);

    await cssBackpackVariables();

    expect(global.warn).toHaveBeenCalledWith(expectedMsgUnits);
    expect(global.warn).toHaveBeenCalledWith(expectedMsgPixel);
  });

  it('should log as "logTypeNonBackpackUnits" when is provided', async () => {
    const files = [invalidUnitsScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({ logTypeNonBackpackUnits: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypeNonBackpackUnits" when "logType" is also provided', async () => {
    const files = [invalidUnitsScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({
      logTypeNonBackpackUnits: 'fail',
      logType: 'message',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypeOnePixelRem" when is provided', async () => {
    const files = [invalidPixelScssCase];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({ logTypeOnePixelRem: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypeOnePixelRem" when "logType" is also provided', async () => {
    const files = [invalidPixelScssCase];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({
      logTypeOnePixelRem: 'fail',
      logType: 'message',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log each message accordingly when "logTypeNonBackpackUnits" and "logTypeOnePixelRem" are provided', async () => {
    const files = [validScss, invalidUnitsScss, invalidPixelScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({
      logTypeNonBackpackUnits: 'message',
      logTypeOnePixelRem: 'fail',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalledWith(
      buildMessageUnits(invalidUnitsScss),
    );
    expect(global.fail).toHaveBeenCalledWith(
      buildMessagePixel(invalidPixelScss),
    );
  });

  it('should log as "logType" when provided but "logTypeNonBackpackUnits" is not ', async () => {
    const files = [validScss, invalidUnitsScss, invalidPixelScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({
      logType: 'message',
      logTypeOnePixelRem: 'fail',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalledWith(
      buildMessageUnits(invalidUnitsScss),
    );
    expect(global.fail).toHaveBeenCalledWith(
      buildMessagePixel(invalidPixelScss),
    );
  });

  it('should log as "logType" when provided but "logTypeOnePixelRem" is not ', async () => {
    const files = [validScss, invalidUnitsScss, invalidPixelScss];
    helpers.setMockCommittedFiles(files);

    await cssBackpackVariables({
      logTypeNonBackpackUnits: 'message',
      logType: 'fail',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalledWith(
      buildMessageUnits(invalidUnitsScss),
    );
    expect(global.fail).toHaveBeenCalledWith(
      buildMessagePixel(invalidPixelScss),
    );
  });
});
