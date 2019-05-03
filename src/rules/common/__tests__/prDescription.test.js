import * as helpers from '../../helpers';
import commonPrDescription from '../prDescription';

const mockHelpers = (isTrivial, prDescription) => {
  helpers.isTrivial = isTrivial;
  helpers.prDescription = prDescription;
};

const errorMsg = 'Please provide a summary in the pull request description.';

describe('commonPrDescription', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when is trivial', () => {
    mockHelpers(true, '');

    commonPrDescription();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when description is long', () => {
    mockHelpers(false, 'a long description');

    commonPrDescription();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when description is short', () => {
    mockHelpers(false, 'abc');

    commonPrDescription();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should allow modifying the description length', () => {
    mockHelpers(false, 'abc');

    commonPrDescription({ minLength: 2 });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers(false, 'a');
    commonPrDescription({ minLength: 2 });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use default min description length when the provided one is not an integer', () => {
    mockHelpers(false, 'abcde');

    commonPrDescription({ minLength: 'z' });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers(false, 'abcd');
    commonPrDescription({ minLength: 'z' });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use default min description length when the provided one is <0', () => {
    mockHelpers(false, 'abcde');

    commonPrDescription({ minLength: -1 });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers(false, 'abcd');
    commonPrDescription({ minLength: -1 });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should trim descriptions', () => {
    const multilineDescription = '  a      \n  bb  ';
    mockHelpers(false, multilineDescription);

    commonPrDescription();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should strip mentions', () => {
    mockHelpers(false, 'abc  @mention');

    commonPrDescription();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use the defined message when is provided', () => {
    mockHelpers(false, 'abc');

    const expectedMsg = 'Expected message';
    commonPrDescription({ msg: expectedMsg });

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should log as "logType" when is provided', () => {
    mockHelpers(false, 'abc');

    commonPrDescription({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
