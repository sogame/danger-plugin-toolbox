//
// Check if "em" are used instead of "rem" in the commited files (scss or css).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgInline =
  'It seems like `em` units are being used, but it is recommended to use `rem` instead.';
const regexUsesEmUnits = /[0-9]em[; ]/;
const usesEmUnits = (filename) =>
  fileAddedLineMatch(filename, regexUsesEmUnits);

const checkEm = async (filename, inline, log) => {
  if (inline === true) {
    inlineLogMatching(filename, regexUsesEmUnits, msgInline, log);
  } else {
    const usesEm = await usesEmUnits(filename);
    if (usesEm) {
      log(
        `The file \`${filename}\` seems to be using \`em\`, but it is recommended to use \`rem\` instead.`,
      );
    }
  }
};

export default async ({ logType, inline } = {}) => {
  const log = getMessageLogger(logType);
  const cssFiles = committedFilesGrep(/(\.scss|\.css)$/i);
  await Promise.all(cssFiles.map((filename) => checkEm(filename, inline, log)));
};
