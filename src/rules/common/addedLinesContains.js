//
// Check if the provided regex matches any added line in the files.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const checkContains = async (filename, lineRegex, inline, msg, log) => {
  if (inline === true) {
    inlineLogMatching(filename, lineRegex, msg, log);
  } else {
    const linesMatchRegex = await fileAddedLineMatch(filename, lineRegex);
    if (linesMatchRegex) {
      log(msg);
    }
  }
};

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
    await Promise.all(
      files.map((filename) => {
        const msg = buildMessage(filename);
        return checkContains(filename, lineRegex, inline, msg, log);
      }),
    );
  }
};
