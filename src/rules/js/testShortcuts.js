//
// Check if there are test shortcuts (skipped/focused tests).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logTypeSkipped, logTypeFocused } = {}) => {
  const hasJsSkippedTests = filename =>
    fileAddedLineMatch(
      filename,
      /xdescribe|describe\.skip|xit|it\.skip|test\.skip/i,
    );

  const hasJsFocusedTests = filename =>
    fileAddedLineMatch(
      filename,
      /fdescribe|describe\.only|fit|it\.only|test\.only/i,
    );

  const logSkipped = getMessageLogger(logTypeSkipped);
  const logFocused = getMessageLogger(logTypeFocused);
  const jsFiles = committedFilesGrep(/(\.test\.js|\.test\.jsx|\.spec\.js)$/i);
  await jsFiles.forEach(async filename => {
    const hasSkippedTests = await hasJsSkippedTests(filename);
    if (hasSkippedTests) {
      logSkipped(`The file \`${filename}\` may contain skipped tests.`);
    }

    const hasFocusedTests = await hasJsFocusedTests(filename);
    if (hasFocusedTests) {
      logFocused(
        `The file \`${filename}\` may contain focused ("only") tests.`,
      );
    }
  });
};
