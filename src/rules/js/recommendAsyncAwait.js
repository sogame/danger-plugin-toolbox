//
// Recommend using Async/Await instead of Promises.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgInline =
  'Seems like Promises are being used, but the preference for this project is to use Async/Await.';
const regexUsesPromises = /(new Promise\()|(\bPromise\.(?!(all)))|(\.then\()|(\.catch\()/;
const fileUsesPromises = filename =>
  fileAddedLineMatch(filename, regexUsesPromises);

export default async ({ logType, inline } = {}) => {
  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/\.(js|jsx|ts)$/i);
  await jsFiles.forEach(async filename => {
    if (inline === true) {
      inlineLogMatching(filename, regexUsesPromises, msgInline, log);
    } else {
      const usesPromises = await fileUsesPromises(filename);
      if (usesPromises) {
        log(
          `The file \`${filename}\` seems to be using Promises, but the preference for this project is to use Async/Await.`,
        );
      }
    }
  });
};
