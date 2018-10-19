//
// If all commits contain the text "[skip release]", show a warning to make sure a new version is not needed.
//

import getMessageLogger from '../getMessageLogger';
import { commits } from '../helpers';

export default ({ logType } = {}) => {
  if (
    commits.findIndex(
      ({ message: commitMessage }) =>
        commitMessage.match(/\[skip release\]/) === null,
    ) < 0
  ) {
    const log = getMessageLogger(logType);
    log(
      'A new version will not be created, as `[skip release]` is part of all commit messages.',
    );
  }
};
