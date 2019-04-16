//
// Recommend using Async/Await instead of Promises.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logType } = {}) => {
  const fileUsesPromises = filename =>
    fileAddedLineMatch(
      filename,
      /(new Promise\()|(\bPromise\.(?!(all)))|(\.then\()|(\.catch\()/,
    );

  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/\.(js|jsx|ts)$/i);
  await jsFiles.forEach(async filename => {
    const usesPromises = await fileUsesPromises(filename);
    if (usesPromises) {
      log(
        `The file \`${filename}\` seems to be using Promises, but the preference for this project is to use Async/Await.`,
      );
    }
  });
};
