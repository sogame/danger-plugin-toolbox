import * as helpers from '../../helpers';
import commonPrDescriptionContribution from '../prDescriptionContribution';

const mockHelpers = (externalPr, isTrivial, prDescription) => {
  /* eslint-disable no-import-assign -- Mocking in a test file */
  helpers.externalPr = externalPr;
  helpers.isTrivial = isTrivial;
  helpers.prDescription = prDescription;
  /* eslint-enable no-import-assign -- Mocking in a test file */
};

const errorMsg = 'Please provide a summary in the pull request description.';

describe('commonPrDescriptionContribution', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when is not external', () => {
    mockHelpers(false, false, '');

    commonPrDescriptionContribution();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when is trivial', () => {
    mockHelpers(true, true, '');

    commonPrDescriptionContribution();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when description is long', () => {
    mockHelpers(true, false, 'a long description');

    commonPrDescriptionContribution();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when description is "null"', () => {
    mockHelpers(true, false, null);

    commonPrDescriptionContribution();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should warn when description is "undefined"', () => {
    mockHelpers(true, false, undefined);

    commonPrDescriptionContribution();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should warn when description is short', () => {
    mockHelpers(true, false, 'abc');

    commonPrDescriptionContribution();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should allow modifying the description length', () => {
    mockHelpers(true, false, 'abc');

    commonPrDescriptionContribution({ minLength: 2 });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers(true, false, 'a');
    commonPrDescriptionContribution({ minLength: 2 });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use default min description length when the provided one is not an integer', () => {
    mockHelpers(true, false, 'abcde');

    commonPrDescriptionContribution({ minLength: 'z' });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers(true, false, 'abcd');
    commonPrDescriptionContribution({ minLength: 'z' });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use default min description length when the provided one is <0', () => {
    mockHelpers(true, false, 'abcde');

    commonPrDescriptionContribution({ minLength: -1 });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers(true, false, 'abcd');
    commonPrDescriptionContribution({ minLength: -1 });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should trim descriptions', () => {
    const multilineDescription = '  a      \n  bb  ';
    mockHelpers(true, false, multilineDescription);

    commonPrDescriptionContribution();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should strip mentions', () => {
    mockHelpers(true, false, 'abc  @mention');

    commonPrDescriptionContribution();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use the defined message when is provided', () => {
    mockHelpers(true, false, 'abc');

    const expectedMsg = 'Expected message';
    commonPrDescriptionContribution({ msg: expectedMsg });

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should log as "logType" when is provided', () => {
    mockHelpers(true, false, 'abc');

    commonPrDescriptionContribution({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
