import * as helpers from '../helpers';
import commonPrDescription from './prDescription';

const mockHelpers = (sourceBranch, targetBranch, isTrivial, prDescription) => {
  helpers.sourceBranch = sourceBranch;
  helpers.targetBranch = targetBranch;
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

  it('should not warn when merging "dev" into "master"', () => {
    mockHelpers('dev', 'master', false, '');

    commonPrDescription();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when merging "develop" into "master"', () => {
    mockHelpers('develop', 'master', false, '');

    commonPrDescription();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when is trivial', () => {
    mockHelpers('foo', 'bar', true, '');

    commonPrDescription();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when description is long', () => {
    mockHelpers('foo', 'bar', false, 'a long description');

    commonPrDescription();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when description is short', () => {
    mockHelpers('foo', 'bar', false, 'abc');

    commonPrDescription();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should allow modifying the description length', () => {
    mockHelpers('foo', 'bar', false, 'abc');

    commonPrDescription({ minLength: 2 });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers('foo', 'bar', false, 'a');
    commonPrDescription({ minLength: 2 });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use default min description length when the provided one is not an integer', () => {
    mockHelpers('foo', 'bar', false, 'abcde');

    commonPrDescription({ minLength: 'z' });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers('foo', 'bar', false, 'abcd');
    commonPrDescription({ minLength: 'z' });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should use default min description length when the provided one is <0', () => {
    mockHelpers('foo', 'bar', false, 'abcde');

    commonPrDescription({ minLength: -1 });

    expect(global.warn).not.toHaveBeenCalled();

    mockHelpers('foo', 'bar', false, 'abcd');
    commonPrDescription({ minLength: -1 });

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should trim descriptions', () => {
    const multilineDescription = '  a      \n  bb  ';
    mockHelpers('foo', 'bar', false, multilineDescription);

    commonPrDescription();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should strip mentions', () => {
    mockHelpers('foo', 'bar', false, 'abc  @mention');

    commonPrDescription();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should log as "logType" when is provided', () => {
    mockHelpers('foo', 'bar', false, 'abc');

    commonPrDescription({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
