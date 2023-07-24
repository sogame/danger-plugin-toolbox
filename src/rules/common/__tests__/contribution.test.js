import * as helpers from '../../helpers';
import commonContribution from '../contribution';

const author = 'John Doe';
// eslint-disable-next-line no-import-assign -- Mocking in a test file
helpers.prAuthor = author;

const buildMessage = (authorName) =>
  `Thanks for the contribution, ${authorName}!`;

describe('commonContribution', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.markdown = jest.fn();

    jest.resetAllMocks();
  });

  it('should not message when is not an external contribution', () => {
    // eslint-disable-next-line no-import-assign -- Mocking in a test file
    helpers.externalPr = false;

    commonContribution();

    expect(global.message).not.toHaveBeenCalled();
  });

  it('should message when is an external contribution', () => {
    // eslint-disable-next-line no-import-assign -- Mocking in a test file
    helpers.externalPr = true;

    const expectedMsg = buildMessage(author);

    commonContribution();

    expect(global.message).toHaveBeenCalledWith(expectedMsg);
  });

  it('should use the defined message when is provided', () => {
    // eslint-disable-next-line no-import-assign -- Mocking in a test file
    helpers.externalPr = true;

    const expectedMsg = 'Expected message';

    commonContribution({ msg: expectedMsg });

    expect(global.message).toHaveBeenCalledWith(expectedMsg);
  });

  it('should log as "logType" when is provided', () => {
    // eslint-disable-next-line no-import-assign -- Mocking in a test file
    helpers.externalPr = true;

    buildMessage(author);

    commonContribution({ logType: 'markdown' });

    expect(global.markdown).toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
  });
});
