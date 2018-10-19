//
// If all commits contain the text "[skip ci]", show a warning to make sure running CI is not needed.
//

import getMessageLogger from '../getMessageLogger';
import { commits } from '../helpers';

export default ({ logType } = {}) => {
  if (
    commits.findIndex(
      ({ message: commitMessage }) =>
        commitMessage.match(/\[skip ci\]/) === null,
    ) < 0
  ) {
    const log = getMessageLogger(logType);
    log(
      'CI will not be executed, as `[skip ci]` is part of all commit messages.',
    );
  }
};
