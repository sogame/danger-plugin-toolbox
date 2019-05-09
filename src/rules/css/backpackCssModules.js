//
// Recommend using Backpack's "cssModules" utility.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logType } = {}) => {
  const fileUsesStylesDirectly = filename =>
    fileAddedLineMatch(filename, /\Wstyles(\[|\.)/i);

  const log = getMessageLogger(logType);
  const jsFiles = committedFilesGrep(/\.(js|jsx|ts)$/i);
  await jsFiles.forEach(async filename => {
    const usesStyles = await fileUsesStylesDirectly(filename);
    if (usesStyles) {
      log(
        `The file \`${filename}\` seems to not be using [Backpack's \`cssModules\` utility](https://github.com/Skyscanner/backpack/tree/master/packages/bpk-react-utils#cssmodulesjs).`,
      );
    }
  });
};
