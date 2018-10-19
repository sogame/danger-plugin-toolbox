//
// Check if "em" are used instead of "rem" in the commited files (scss or css).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logType } = {}) => {
  const usesEmUnits = filename => fileAddedLineMatch(filename, /[0-9]em[; ]/);

  const log = getMessageLogger(logType);
  const cssFiles = committedFilesGrep(/(\.scss|\.css)$/i);
  await cssFiles.forEach(async filename => {
    const usesEm = await usesEmUnits(filename);
    if (usesEm) {
      log(
        `The file \`${filename}\` seems to be using \`em\`, but it is recommended to use \`rem\` instead.`,
      );
    }
  });
};
