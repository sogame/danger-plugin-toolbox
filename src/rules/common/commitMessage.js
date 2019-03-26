//
// Make sure all commit messages match a regex.
//

import getMessageLogger from '../getMessageLogger';
import { commits } from '../helpers';

export const COMMON_COMMIT_MESSAGE_JIRA_REGEX = /^(\[[a-z]+-\d+\] )|([a-z]+-\d+ )|(\[NO-JIRA\] )|(NO-JIRA )/i;
export const COMMON_COMMIT_MESSAGE_JIRA_MSG =
  'Please include a JIRA reference like `[XXX-DDDD]` in each commit or use `[NO-JIRA]`.';

export default (regex, message, { logType } = {}) => {
  if (!regex) {
    warn('`commonCommitMessage`: missing "regex" parameter');
  } else if (!message) {
    warn('`commonCommitMessage`: missing "message" parameter');
  } else if (
    commits.findIndex(
      ({ message: commitMessage }) => commitMessage.match(regex) === null,
    ) >= 0
  ) {
    const log = getMessageLogger(logType);
    log(message);
  }
};
