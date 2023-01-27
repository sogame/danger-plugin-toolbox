//
// Check if there are console commands (logs/asserts/counts/times/profiles/...).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgInline = 'Seems like a console command is being used.';
const regexJsConsoleCommands = /console\.[a-z]+/;
const hasJsConsoleCommands = (filename) =>
  fileAddedLineMatch(filename, regexJsConsoleCommands);

const checkConsole = async (filename, ignorePathRegex, inline, log) => {
  if (!ignorePathRegex || !filename.match(ignorePathRegex)) {
    if (inline === true) {
      inlineLogMatching(filename, regexJsConsoleCommands, msgInline, log);
    } else {
      const hasConsole = await hasJsConsoleCommands(filename);
      if (hasConsole) {
        log(`The file \`${filename}\` may contain console commands.`);
      }
    }
  }
};

export default async ({ ignorePathRegex, inline, logType } = {}) => {
  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/\.(js|jsx|ts|tsx)$/i);
  await Promise.all(
    jsFiles.map((filename) =>
      checkConsole(filename, ignorePathRegex, inline, log),
    ),
  );
};
