//
// Check all added files have an owner defined in codeowners.
//

import getMessageLogger from '../getMessageLogger';
import { committedFilesGrep, getFileOwners } from '../helpers';

export default ({
  codeownersPath = 'CODEOWNERS',
  logType,
  pathsPattern = /.*/,
} = {}) => {
  const log = getMessageLogger(logType);
  const files = committedFilesGrep(pathsPattern);
  files.forEach((file) => {
    const owners = getFileOwners(file, codeownersPath);
    if (owners === undefined) {
      log(
        `The file \`${file}\` does not have an owner defined in \`${codeownersPath}\`.`,
      );
    }
  });
};
