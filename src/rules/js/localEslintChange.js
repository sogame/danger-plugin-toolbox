//
// Check if eslint has been disabled in the commited files (js or jsx).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logType } = {}) => {
  const hasDisabledEslint = filename =>
    fileAddedLineMatch(filename, /eslint-disable/);

  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/(\.js|\.jsx)$/i);
  await jsFiles.forEach(async filename => {
    const hasDisabledRules = await hasDisabledEslint(filename);
    if (hasDisabledRules) {
      log(`The file \`${filename}\` may have disabled some eslint rule.`);
    }
  });
};
