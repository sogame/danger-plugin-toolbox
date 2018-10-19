//
// Check if there are console commands (logs/asserts/counts/times/profiles/...).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logType } = {}) => {
  const hasJsConsoleCommands = filename =>
    fileAddedLineMatch(filename, /console\.[a-z]+/);

  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/(\.js|\.jsx)$/i);
  await jsFiles.forEach(async filename => {
    const hasConsole = await hasJsConsoleCommands(filename);
    if (hasConsole) {
      log(`The file \`${filename}\` may contain console commands.`);
    }
  });
};
