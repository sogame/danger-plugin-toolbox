//
// Check there is a description in the PR (unless the PR is flagged as trivial).
//

import getMessageLogger from '../getMessageLogger';
import { isTrivial, prDescription } from '../helpers';

const DEFAULT_MIN_LENGTH = 5;

export default ({ logType, minLength, msg } = {}) => {
  const prDescNoMentions = (prDescription || '').replace(/@\w+/, '');
  const prDescLines = prDescNoMentions.split('\n').map(line => line.trim());
  const prDescText = prDescLines.join('');

  const minDescLength =
    !Number.isInteger(minLength) || minLength < 0
      ? DEFAULT_MIN_LENGTH
      : minLength;
  if (!isTrivial && prDescText.length < minDescLength) {
    const log = getMessageLogger(logType);
    log(msg || 'Please provide a summary in the pull request description.');
  }
};
