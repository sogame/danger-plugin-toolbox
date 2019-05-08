//
// Check if there are test shortcuts (skipped/focused tests).
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgSkippedTests = 'Seems like a test is being skipped.';
const regexJsSkippedTests = /(xdescribe|describe\.skip|xit|it\.skip|test\.skip)\(/i;
const hasJsSkippedTests = filename =>
  fileAddedLineMatch(filename, regexJsSkippedTests);

const msgFocusedTests = 'Seems like a test is being focused.';
const regexJsFocusedTests = /(fdescribe|describe\.only|fit|it\.only|test\.only)\(/i;
const hasJsFocusedTests = filename =>
  fileAddedLineMatch(filename, regexJsFocusedTests);

export default async ({
  logTypeSkipped,
  logTypeFocused,
  logType,
  inline,
} = {}) => {
  const logSkipped = getMessageLogger(logTypeSkipped || logType);
  const logFocused = getMessageLogger(logTypeFocused || logType);
  const jsFiles = committedFilesGrep(/\.(test|spec)\.(js|jsx|ts)$/i);
  await jsFiles.forEach(async filename => {
    if (inline === true) {
      inlineLogMatching(
        filename,
        regexJsSkippedTests,
        msgSkippedTests,
        logSkipped,
      );

      inlineLogMatching(
        filename,
        regexJsFocusedTests,
        msgFocusedTests,
        logFocused,
      );
    } else {
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
    }
  });
};
