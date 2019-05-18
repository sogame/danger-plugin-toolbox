import * as helpers from '../../helpers';
import reactBackpackCssModules from '../backpackCssModules';

const valid = 'valid.jsx';
const invalidObject = 'invalidObject.jsx';
const invalidArray = 'invalidArray.jsx';
const invalidCase = 'invalid.JsX';
const mockFiles = {
  [valid]: '<div className={getClassName("foo")}>bar</div>',
  [invalidObject]: '<div className={STYLES.foo}>bar</div>',
  [invalidArray]: '<div className={STYLES["foo"]}>bar</div>',
  [invalidCase]: '<div className={STYLES.foo}>bar</div>',
};

helpers.setMockFilesContent(mockFiles);

describe('reactBackpackCssModules', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when "styles" is not being used', async () => {
    const files = [valid];
    helpers.setMockCommittedFiles(files);

    await reactBackpackCssModules();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when "styles.foo" is being used', async () => {
    const files = [valid, invalidObject];
    helpers.setMockCommittedFiles(files);

    await reactBackpackCssModules();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidObject),
    );
  });

  it('should warn when "styles[foo]" is being used', async () => {
    const files = [valid, invalidArray];
    helpers.setMockCommittedFiles(files);

    await reactBackpackCssModules();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidArray),
    );
  });

  it('should ignore file extension casing', async () => {
    const files = [invalidCase];
    helpers.setMockCommittedFiles(files);

    await reactBackpackCssModules();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidCase),
    );
  });

  it('should log as "logType" when is provided', async () => {
    const files = [invalidObject];
    helpers.setMockCommittedFiles(files);

    await reactBackpackCssModules({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
