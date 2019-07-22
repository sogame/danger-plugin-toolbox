import * as helpers from '../../helpers';
import commonCommitMessage, {
  COMMON_COMMIT_MESSAGE_JIRA_REGEX,
} from '../commitMessage';

const mockCommits = messages => {
  helpers.commits = messages.map(message => ({ message }));
};

describe('commonCommitMessage', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  const errorMsg = 'Failed message';

  it('should not warn when all commits match the regex', () => {
    const messages = ['message 1', 'message 2'];
    mockCommits(messages);

    commonCommitMessage(/^message/, errorMsg);

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when any commit does not match the regex', () => {
    const messages = ['message 1', 'foo 1'];
    mockCommits(messages);

    commonCommitMessage(/^message/, errorMsg);

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
    expect(global.warn).toHaveBeenCalledTimes(1);
  });

  it('should warn when none of the commits match the regex', () => {
    const messages = ['foo 1', 'foo 2'];
    mockCommits(messages);

    commonCommitMessage(/^message/, errorMsg);

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
    expect(global.warn).toHaveBeenCalledTimes(1);
  });

  it('should log as "logType" when is provided', () => {
    const messages = ['foo 1', 'foo 2'];
    mockCommits(messages);

    commonCommitMessage(/^message/, errorMsg, { logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should show a warning when the "regex" parameter is missing', () => {
    commonCommitMessage();

    const message = '`commonCommitMessage`: missing "regex" parameter';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should show a warning when the "message" parameter is missing', () => {
    commonCommitMessage(/a/);

    const message = '`commonCommitMessage`: missing "message" parameter';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  describe('exported regex', () => {
    describe('Jira', () => {
      it('should match strings starting with a Jira ticket in braces', () => {
        const message = '[FOO-123] Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should match strings starting with a Jira ticket without braces', () => {
        const message = 'FOO-123 Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should match strings starting with a Jira ticket and a colon', () => {
        const message = 'FOO-123: Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should match strings starting with "[NO-JIRA]"', () => {
        const message = '[NO-JIRA] Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should match strings starting with "NO-JIRA"', () => {
        const message = 'NO-JIRA Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should match strings starting with "NO-JIRA:"', () => {
        const message = 'NO-JIRA: Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should be case insensitive (Jira ticket)', () => {
        const message = '[fOo-123] Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should be case insensitive (NO-JIRA)', () => {
        const message = 'No-Jira Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).not.toBeNull();
      });

      it('should not match when the ticket is not at the start of the string', () => {
        const message = 'Some text [FOO-123]';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).toBeNull();
      });

      it('should not match a string in braces', () => {
        const message = '[FOO] Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).toBeNull();
      });

      it('should not match if there is no space after the Jira ticket', () => {
        const message = '[FOO-123]Some text';

        const result = message.match(COMMON_COMMIT_MESSAGE_JIRA_REGEX);

        expect(result).toBeNull();
      });
    });
  });
});
