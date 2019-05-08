//
// Check if there are console commands (logs/asserts/counts/times/profiles/...).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgInline = 'Seems like a console command is being used.';
const regexJsConsoleCommands = /console\.[a-z]+/;
const hasJsConsoleCommands = filename =>
  fileAddedLineMatch(filename, regexJsConsoleCommands);

export default async ({ logType, inline } = {}) => {
  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/\.(js|jsx|ts)$/i);
  await jsFiles.forEach(async filename => {
    if (inline === true) {
      inlineLogMatching(filename, regexJsConsoleCommands, msgInline, log);
    } else {
      const hasConsole = await hasJsConsoleCommands(filename);
      if (hasConsole) {
        log(`The file \`${filename}\` may contain console commands.`);
      }
    }
  });
};
