//
// Check if the provided regex matches any added line in the files.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

export default async (
  filesRegex,
  lineRegex,
  buildMessage,
  { logType, inline } = {},
) => {
  if (!filesRegex) {
    warn('`commonAddedLinesContains`: missing "filesRegex" parameter.');
  } else if (!lineRegex) {
    warn('`commonAddedLinesContains`: missing "lineRegex" parameter.');
  } else if (!buildMessage) {
    warn('`commonAddedLinesContains`: missing "buildMessage" parameter.');
  } else {
    const log = getMessageLogger(logType);
    const files = committedFilesGrep(filesRegex);
    await files.forEach(async filename => {
      const msg = buildMessage(filename);
      if (inline === true) {
        inlineLogMatching(filename, lineRegex, msg, log);
      } else {
        const linesMatchRegex = await fileAddedLineMatch(filename, lineRegex);
        if (linesMatchRegex) {
          log(msg);
        }
      }
    });
  }
};
