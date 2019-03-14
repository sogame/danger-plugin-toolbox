//
// Check if there are test shortcuts (skipped/focused tests).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logTypeSkipped, logTypeFocused, logType } = {}) => {
  const hasJsSkippedTests = filename =>
    fileAddedLineMatch(
      filename,
      /^\s*(xdescribe|describe\.skip|xit|it\.skip|test\.skip)\(/i,
    );

  const hasJsFocusedTests = filename =>
    fileAddedLineMatch(
      filename,
      /^\s*(fdescribe|describe\.only|fit|it\.only|test\.only)\(/i,
    );

  const logSkipped = getMessageLogger(logTypeSkipped || logType);
  const logFocused = getMessageLogger(logTypeFocused || logType);
  const jsFiles = committedFilesGrep(/\.(test|spec)\.(js|jsx|ts)$/i);
  await jsFiles.forEach(async filename => {
    const [hasSkippedTests, hasFocusedTests] = await Promise.all([
      hasJsSkippedTests(filename),
      hasJsFocusedTests(filename),
    ]);

    if (hasSkippedTests) {
      logSkipped(`The file \`${filename}\` may contain skipped tests.`);
    }

    if (hasFocusedTests) {
      logFocused(
        `The file \`${filename}\` may contain focused ("only") tests.`,
      );
    }
  });
};
