import * as helpers from '../../helpers';
import commonCommitMessage, {
  COMMON_COMMIT_MESSAGE_JIRA_REGEX,
  COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REGEX,
  COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX,
  COMMON_COMMIT_MESSAGE_NO_JIRA_REGEX,
  COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REGEX,
  COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REVERT_REGEX,
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

  describe('Regular match', () => {
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
  });

  describe('Reverse match', () => {
    it('should warn when all commits match the regex', () => {
      const messages = ['message 1', 'message 2'];
      mockCommits(messages);

      commonCommitMessage(/^message/, errorMsg, { reverse: true });

      expect(global.warn).toHaveBeenCalledWith(errorMsg);
      expect(global.warn).toHaveBeenCalledTimes(1);
    });

    it('should warn when any commit does match the regex', () => {
      const messages = ['message 1', 'foo 1'];
      mockCommits(messages);

      commonCommitMessage(/^message/, errorMsg, { reverse: true });

      expect(global.warn).toHaveBeenCalledWith(errorMsg);
      expect(global.warn).toHaveBeenCalledTimes(1);
    });

    it('should not warn when none of the commits match the regex', () => {
      const messages = ['foo 1', 'foo 2'];
      mockCommits(messages);

      commonCommitMessage(/^message/, errorMsg, { reverse: true });

      expect(global.warn).not.toHaveBeenCalled();
    });
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

    const message = '`commonCommitMessage`: missing "regex" parameter.';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should show a warning when the "message" parameter is missing', () => {
    commonCommitMessage(/a/);

    const message = '`commonCommitMessage`: missing "message" parameter.';

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  describe('Exported regex', () => {
    describe('Jira or Merge or Revert', () => {
      it('should match strings starting with "Revert"', () => {
        const message = 'Revert "My PR title"';

        const result = message.match(
          COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX,
        );

        expect(result).not.toBeNull();
      });
    });

    describe.each([
      [
        'Jira or Merge or Revert',
        COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX,
      ],
      ['Jira or Merge', COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REGEX],
    ])('%s', (type, regex) => {
      it('should match strings starting with the merge pr message - Jira', () => {
        const message =
          'Merge pull request #123 from sogame/danger-plugin-toolbox';

        const result = message.match(regex);

        expect(result).not.toBeNull();
      });

      it('should match strings starting with the merge branch message - Jira', () => {
        const message = "Merge branch 'master' of sogame/danger-plugin-toolbox";

        const result = message.match(regex);

        expect(result).not.toBeNull();
      });
    });

    describe('No-Jira or Merge or Revert', () => {
      it('should match strings starting with "Revert"', () => {
        const message = 'Revert "My PR title"';

        const result = message.match(
          COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REVERT_REGEX,
        );

        expect(result).not.toBeNull();
      });
    });

    describe.each([
      [
        'No-Jira or Merge or Revert',
        COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REVERT_REGEX,
      ],
      ['No-Jira or Merge', COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REGEX],
    ])('%s', (type, regex) => {
      it('should match strings starting with the merge pr message - No-Jira', () => {
        const message =
          'Merge pull request #123 from sogame/danger-plugin-toolbox';

        const result = message.match(regex);

        expect(result).not.toBeNull();
      });

      it('should match strings starting with the merge branch message - No-Jira', () => {
        const message = "Merge branch 'master' of sogame/danger-plugin-toolbox";

        const result = message.match(regex);

        expect(result).not.toBeNull();
      });
    });

    describe('Jira', () => {
      describe.each([
        [
          'Jira or Merge or Revert',
          COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX,
        ],
        ['Jira or Merge', COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REGEX],
        ['Jira Only', COMMON_COMMIT_MESSAGE_JIRA_REGEX],
      ])('%s', (type, regex) => {
        it(`should match strings starting with a Jira ticket in brackets - ${type}`, () => {
          const message = '[FOO-123] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with a Jira ticket in brackets and a colon - ${type}`, () => {
          const message = '[FOO-123]: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with a Jira ticket without brackets - ${type}`, () => {
          const message = 'FOO-123 Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with a Jira ticket and a colon - ${type}`, () => {
          const message = 'FOO-123: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NO-JIRA]" - ${type}`, () => {
          const message = '[NO-JIRA] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NOJIRA]" - ${type}`, () => {
          const message = '[NOJIRA] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NO JIRA]" - ${type}`, () => {
          const message = '[NO JIRA] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NO-JIRA]:" - ${type}`, () => {
          const message = '[NO-JIRA]: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NOJIRA]:" - ${type}`, () => {
          const message = '[NOJIRA]: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NO JIRA]:" - ${type}`, () => {
          const message = '[NO JIRA]: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO-JIRA" - ${type}`, () => {
          const message = 'NO-JIRA Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NOJIRA" - ${type}`, () => {
          const message = 'NOJIRA Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO JIRA" - ${type}`, () => {
          const message = 'NO JIRA Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO-JIRA:" - ${type}`, () => {
          const message = 'NO-JIRA: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NOJIRA:" - ${type}`, () => {
          const message = 'NOJIRA: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO JIRA:" - ${type}`, () => {
          const message = 'NO JIRA: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should be case insensitive (Jira ticket) - ${type}`, () => {
          const message = '[fOo-123] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should be case insensitive (NO-JIRA) - ${type}`, () => {
          const message = 'No-Jira Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should not match when the ticket is not at the start of the string - ${type}`, () => {
          const message = 'Some text FOO-123 more';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should not match a string in brackets - ${type}`, () => {
          const message = '[FOO] Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should not match if there is no space after the Jira ticket - ${type}`, () => {
          const message = '[FOO-123]Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });
      });

      describe.each([
        [
          'No-Jira or Merge or Revert',
          COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REVERT_REGEX,
        ],
        ['No-Jira or Merge', COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REGEX],
        ['No-Jira Only', COMMON_COMMIT_MESSAGE_NO_JIRA_REGEX],
      ])('%s', (type, regex) => {
        it(`should not match strings starting with a Jira ticket in brackets - ${type}`, () => {
          const message = '[FOO-123] Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should not match strings starting with a Jira ticket in brackets and a colon - ${type}`, () => {
          const message = '[FOO-123]: Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should not match strings starting with a Jira ticket without brackets - ${type}`, () => {
          const message = 'FOO-123 Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should not match strings starting with a Jira ticket and a colon - ${type}`, () => {
          const message = 'FOO-123: Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should match strings starting with "[NO-JIRA]" - ${type}`, () => {
          const message = '[NO-JIRA] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NOJIRA]" - ${type}`, () => {
          const message = '[NOJIRA] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NO JIRA]" - ${type}`, () => {
          const message = '[NO JIRA] Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NO-JIRA]:" - ${type}`, () => {
          const message = '[NO-JIRA]: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NOJIRA]:" - ${type}`, () => {
          const message = '[NOJIRA]: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "[NO JIRA]:" - ${type}`, () => {
          const message = '[NO JIRA]: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO-JIRA" - ${type}`, () => {
          const message = 'NO-JIRA Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NOJIRA" - ${type}`, () => {
          const message = 'NOJIRA Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO JIRA" - ${type}`, () => {
          const message = 'NO JIRA Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO-JIRA:" - ${type}`, () => {
          const message = 'NO-JIRA: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NOJIRA:" - ${type}`, () => {
          const message = 'NOJIRA: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should match strings starting with "NO JIRA:" - ${type}`, () => {
          const message = 'NO JIRA: Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should be case insensitive (Jira ticket) - ${type}`, () => {
          const message = '[fOo-123] Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should be case insensitive (NO-JIRA) - ${type}`, () => {
          const message = 'No-Jira Some text';

          const result = message.match(regex);

          expect(result).not.toBeNull();
        });

        it(`should not match when the ticket is not at the start of the string - ${type}`, () => {
          const message = 'Some text FOO-123 more';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should not match a string in brackets - ${type}`, () => {
          const message = '[FOO] Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });

        it(`should not match if there is no space after no-jira - ${type}`, () => {
          const message = '[NO-JIRA]Some text';

          const result = message.match(regex);

          expect(result).toBeNull();
        });
      });
    });
  });
});
