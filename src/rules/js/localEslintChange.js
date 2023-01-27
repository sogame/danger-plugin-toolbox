//
// Check if eslint has been disabled in the commited files.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgInline = 'Seems like some eslint rule is being disabled.';
const regexDisabledEslint = /eslint-disable/;
const hasDisabledEslint = (filename) =>
  fileAddedLineMatch(filename, regexDisabledEslint);

const checkEslint = async (filename, inline, log) => {
  if (inline === true) {
    inlineLogMatching(filename, regexDisabledEslint, msgInline, log);
  } else {
    const hasDisabledRules = await hasDisabledEslint(filename);
    if (hasDisabledRules) {
      log(`The file \`${filename}\` may have disabled some eslint rule.`);
    }
  }
};

export default async ({ inline, logType } = {}) => {
  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/\.(js|jsx|ts|tsx)$/i);
  await Promise.all(
    jsFiles.map((filename) => checkEslint(filename, inline, log)),
  );
};
