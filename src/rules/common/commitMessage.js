//
// Make sure all commit messages match a regex.
//

import getMessageLogger from '../getMessageLogger';
import { commits } from '../helpers';

export const COMMON_COMMIT_MESSAGE_JIRA_REGEX = /^((\[[a-z]+-\d+\]:?)|([a-z]+-\d+:?)|(\[NO[- ]?JIRA\]:?)|(NO[- ]?JIRA:?)) /i;
export const COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REGEX = /^((\[[a-z]+-\d+\]:?)|([a-z]+-\d+:?)|(\[NO[- ]?JIRA\]:?)|(NO[- ]?JIRA:?)|(Merge branch)|(Merge pull request)) /i;
export const COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX = /^((\[[a-z]+-\d+\]:?)|([a-z]+-\d+:?)|(\[NO[- ]?JIRA\]:?)|(NO[- ]?JIRA:?)|(Merge branch)|(Merge pull request)|(Revert)) /i;
export const COMMON_COMMIT_MESSAGE_NO_JIRA_REGEX = /^((\[NO[- ]?JIRA\]:?)|(NO[- ]?JIRA:?)) /i;
export const COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REGEX = /^((\[NO[- ]?JIRA\]:?)|(NO[- ]?JIRA:?)|(Merge branch)|(Merge pull request)) /i;
export const COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REVERT_REGEX = /^((\[NO[- ]?JIRA\]:?)|(NO[- ]?JIRA:?)|(Merge branch)|(Merge pull request)|(Revert)) /i;
export const COMMON_COMMIT_MESSAGE_JIRA_MSG =
  'Please include a JIRA ticket (like `XXX-DDDD` or `NO-JIRA` if there is no ticket) at the beginning of each commit.';

export default (regex, message, { logType, reverse } = {}) => {
  if (!regex) {
    warn('`commonCommitMessage`: missing "regex" parameter.');
  } else if (!message) {
    warn('`commonCommitMessage`: missing "message" parameter.');
  } else {
    const hasMatching =
      commits.findIndex(
        ({ message: commitMessage }) => commitMessage.match(regex) !== null,
      ) >= 0;
    const hasNonMatching =
      commits.findIndex(
        ({ message: commitMessage }) => commitMessage.match(regex) === null,
      ) >= 0;

    const matchRegular = !reverse && hasNonMatching;
    const matchReverse = reverse && hasMatching;

    if (matchRegular || matchReverse) {
      const log = getMessageLogger(logType);
      log(message);
    }
  }
};
