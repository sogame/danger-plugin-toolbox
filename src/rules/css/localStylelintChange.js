//
// Check if stylelint has been disabled in the commited files (scss or css).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgInline = 'Seems like some stylelint rule is being disabled.';
const regexDisabledStylelint = /stylelint-disable/;
const hasDisabledStylelint = filename =>
  fileAddedLineMatch(filename, regexDisabledStylelint);

export default async ({ logType, inline } = {}) => {
  const log = getMessageLogger(logType);
  const cssFiles = committedFilesGrep(/(\.scss|\.css)$/i);
  await cssFiles.forEach(async filename => {
    if (inline === true) {
      inlineLogMatching(filename, regexDisabledStylelint, msgInline, log);
    } else {
      const hasDisabledRules = await hasDisabledStylelint(filename);
      if (hasDisabledRules) {
        log(`The file \`${filename}\` may have disabled some stylelint rule.`);
      }
    }
  });
};
