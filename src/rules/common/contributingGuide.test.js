import * as helpers from '../helpers';
import commonContributingGuide from './contributingGuide';

const author = 'John Doe';
helpers.prAuthor = author;

const buildMessage = (authorName, filename) =>
  `Thanks for the contribution, ${authorName}! Please, make sure to follow our [[${filename}]].`;

describe('commonContributingGuide', () => {
  beforeEach(() => {
    global.message = jest.fn();

    jest.resetAllMocks();
  });

  it('should not message when is not an external contribution', () => {
    helpers.externalPr = false;

    commonContributingGuide();

    expect(global.message).not.toHaveBeenCalled();
  });

  it('should message when is an external contribution', () => {
    helpers.externalPr = true;

    const expectedMsg = buildMessage(author, 'CONTRIBUTING.md');

    commonContributingGuide();

    expect(global.message).toHaveBeenCalledWith(expectedMsg);
  });

  it('should allow modifying the contributing filename', () => {
    helpers.externalPr = true;

    const newFilename = 'another_contributing.md';
    const expectedMsg = buildMessage(author, newFilename);

    commonContributingGuide({ contributingFile: newFilename });

    expect(global.message).toHaveBeenCalledWith(expectedMsg);
  });
});
