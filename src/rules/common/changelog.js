//
// Make sure "CHANGELOG.md" has been updated.
//

import getMessageLogger from '../getMessageLogger';
import { inCommit, isTrivial } from '../helpers';

export default ({ logType, changelogFile } = {}) => {
  const filename = changelogFile || 'CHANGELOG.md';
  const changedChangelog = inCommit(filename);
  if (!changedChangelog && !isTrivial) {
    const log = getMessageLogger(logType);
    log(`\`${filename}\` has not been updated.`);
  }
};
