//
// Make sure all commit messages match a regex.
//

import { stringArrayToList } from '../../utils';
import getMessageLogger from '../getMessageLogger';
import { commits } from '../helpers';

const matchEnd = '(\\W+| |$)';
const squareBracketsJiraId = `(\\[[a-z]+-\\d+\\]${matchEnd})`;
const jiraId = `([a-z]+-\\d+${matchEnd})`;
const squareBracketsNoJira = `(\\[NO[- ]?JIRA\\]${matchEnd})`;
const noJira = `(NO[- ]?JIRA${matchEnd})`;
const merge = '(Merge branch )|(Merge pull request )';
const revert = '(Revert )';
const dependencyBump =
  '(Bump \\S+ from [0-9]+\\.[0-9]+\\.[0-9]+ to [0-9]+\\.[0-9]+\\.[0-9]+$)';

export const COMMON_COMMIT_MESSAGE_JIRA_REGEX = new RegExp(
  `^(${squareBracketsJiraId}|${jiraId}|${squareBracketsNoJira}|${noJira})`,
  'i',
);
export const COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REGEX = new RegExp(
  `^(${squareBracketsJiraId}|${jiraId}|${squareBracketsNoJira}|${noJira}|${merge})`,
  'i',
);
export const COMMON_COMMIT_MESSAGE_JIRA_OR_MERGE_REVERT_REGEX = new RegExp(
  `^(${squareBracketsJiraId}|${jiraId}|${squareBracketsNoJira}|${noJira}|${merge}|${revert})`,
  'i',
);
export const COMMON_COMMIT_MESSAGE_JIRA_OR_COMMON_EXCEPTIONS_REGEX = new RegExp(
  `^(${squareBracketsJiraId}|${jiraId}|${squareBracketsNoJira}|${noJira}|${merge}|${revert}|${dependencyBump})`,
  'i',
);
export const COMMON_COMMIT_MESSAGE_NO_JIRA_REGEX = new RegExp(
  `^(${squareBracketsNoJira}|${noJira})`,
  'i',
);
export const COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REGEX = new RegExp(
  `^(${squareBracketsNoJira}|${noJira}|${merge})`,
  'i',
);
export const COMMON_COMMIT_MESSAGE_NO_JIRA_OR_MERGE_REVERT_REGEX = new RegExp(
  `^(${squareBracketsNoJira}|${noJira}|${merge}|${revert})`,
  'i',
);
export const COMMON_COMMIT_MESSAGE_JIRA_MSG =
  'Please include a JIRA ticket (like `XXX-DDDD` or `NO-JIRA` if there is no ticket) at the beginning of each commit.';

const buildFinalMessage = (message, foundCommits, hideCommits) => {
  if (hideCommits === true) {
    return message;
  }

  const commitMessages = foundCommits.map(
    ({ message: commitMessage }) => commitMessage,
  );
  const commitMessagesStr = stringArrayToList(commitMessages, true);
  return `${message}<br>${commitMessagesStr}`;
};

export default (
  regex,
  message,
  { logType, reverse, ignoredAuthors = [], hideCommits } = {},
) => {
  if (!regex) {
    warn('`commonCommitMessage`: missing "regex" parameter.');
  } else if (!message) {
    warn('`commonCommitMessage`: missing "message" parameter.');
  } else {
    const validCommits = ignoredAuthors.length
      ? commits.filter(({ author: { name } }) => !ignoredAuthors.includes(name))
      : commits;

    const matchingCommits = validCommits.filter(
      ({ message: commitMessage }) => commitMessage.match(regex) !== null,
    );
    const hasMatching = matchingCommits.length > 0;

    const nonMatchingCommits = validCommits.filter(
      ({ message: commitMessage }) => commitMessage.match(regex) === null,
    );
    const hasNonMatching = nonMatchingCommits.length > 0;

    const matchRegular = !reverse && hasNonMatching;
    const matchReverse = reverse && hasMatching;

    if (matchRegular || matchReverse) {
      const foundCommits = matchRegular ? nonMatchingCommits : matchingCommits;
      const finalMessage = buildFinalMessage(
        message,
        foundCommits,
        hideCommits,
      );

      const log = getMessageLogger(logType);
      log(finalMessage);
    }
  }
};
