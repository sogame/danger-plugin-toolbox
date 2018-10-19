//
// If there's a commit that does not contain the text "[skip release]", show a message to make sure a new version is needed.
//

import getMessageLogger from '../getMessageLogger';
import { commits } from '../helpers';

export default ({ logType } = {}) => {
  if (
    commits.findIndex(
      ({ message: commitMessage }) =>
        commitMessage.match(/\[skip release\]/) === null,
    ) >= 0
  ) {
    const log = getMessageLogger(logType);
    log(
      'If the changes do not require a new version, remember to add `[skip release]` to the commit messages to avoid creating a new version.',
    );
  }
};
