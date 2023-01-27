//
// Recommend using Async/Await instead of Promises.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgInline =
  'Seems like Promises are being used, but the preference for this project is to use Async/Await.';
const regexUsesPromises =
  /(new Promise\()|(\bPromise\.(?!(all)))|(\.then\()|(\.catch\()/;
const fileUsesPromises = (filename) =>
  fileAddedLineMatch(filename, regexUsesPromises);

const regexJsFiles = /\.(js|jsx|ts|tsx)$/i;
const regexTestJsFiles =
  /(\.(test|spec)\.(js|jsx|ts|tsx)$)|((\/|^)__tests__\/)|((\/|^)tests\/)|((\/|^)__mocks__\/)/i;

const checkPromise = async (filename, ignoreTests, inline, log) => {
  if (ignoreTests !== true || filename.match(regexTestJsFiles) === null) {
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
  }
};

export default async ({ ignoreTests, inline, logType } = {}) => {
  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(regexJsFiles);
  await Promise.all(
    jsFiles.map((filename) => checkPromise(filename, ignoreTests, inline, log)),
  );
};
