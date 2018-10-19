import * as helpers from '../helpers';
import commonContribution from './contribution';

const author = 'John Doe';
helpers.prAuthor = author;

const buildMessage = authorName =>
  `Thanks for the contribution, ${authorName}!`;

describe('commonContribution', () => {
  beforeEach(() => {
    global.message = jest.fn();

    jest.resetAllMocks();
  });

  it('should not message when is not an external contribution', () => {
    helpers.externalPr = false;

    commonContribution();

    expect(global.message).not.toHaveBeenCalled();
  });

  it('should message when is an external contribution', () => {
    helpers.externalPr = true;

    const expectedMsg = buildMessage(author);

    commonContribution();

    expect(global.message).toHaveBeenCalledWith(expectedMsg);
  });

  it('should use the defined message when is provided', () => {
    helpers.externalPr = true;

    const expectedMsg = 'Expected message';

    commonContribution({ msg: expectedMsg });

    expect(global.message).toHaveBeenCalledWith(expectedMsg);
  });
});
