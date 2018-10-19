//
// Check if stylelint has been disabled in the commited files (scss or css).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logType } = {}) => {
  const hasDisabledStylelint = filename =>
    fileAddedLineMatch(filename, /stylelint-disable/);

  const log = getMessageLogger(logType);
  const cssFiles = committedFilesGrep(/(\.scss|\.css)$/i);
  await cssFiles.forEach(async filename => {
    const hasDisabledRules = await hasDisabledStylelint(filename);
    if (hasDisabledRules) {
      log(`The file \`${filename}\` may have disabled some stylelint rule.`);
    }
  });
};
