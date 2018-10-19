//
// Check there is a description in the PR (unless the PR is flagged as trivial or it is from "dev" or "develop" into "master").
//

import getMessageLogger from '../getMessageLogger';
import {
  sourceBranch,
  targetBranch,
  isTrivial,
  prDescription,
} from '../helpers';

const DEFAULT_MIN_LENGTH = 5;

export default ({ logType, minLength } = {}) => {
  const isDevToMaster =
    (sourceBranch === 'dev' || sourceBranch === 'develop') &&
    targetBranch === 'master';
  const skipCheck = isTrivial || isDevToMaster;
  const prDescNoMentions = prDescription.replace(/@\w+/, '');
  const prDescLines = prDescNoMentions.split('\n').map(line => line.trim());
  const prDescText = prDescLines.join('');

  const minDescLength =
    !Number.isInteger(minLength) || minLength < 0
      ? DEFAULT_MIN_LENGTH
      : minLength;
  if (prDescText.length < minDescLength && !skipCheck) {
    const log = getMessageLogger(logType);
    log('Please provide a summary in the pull request description.');
  }
};
