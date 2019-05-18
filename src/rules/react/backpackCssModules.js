//
// Recommend using Backpack's "cssModules" utility in React components.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

const fileUsesStylesDirectly = filename =>
  fileAddedLineMatch(filename, /\Wstyles(\[|\.)/i);

export default async ({ logType } = {}) => {
  const log = getMessageLogger(logType);
  const jsxFiles = committedFilesGrep(/\.jsx$/i);
  jsxFiles.forEach(async filename => {
    const usesStyles = await fileUsesStylesDirectly(filename);
    if (usesStyles) {
      log(
        `The file \`${filename}\` seems to not be using [Backpack's \`cssModules\` utility](https://github.com/Skyscanner/backpack/tree/master/packages/bpk-react-utils#cssmodulesjs).`,
      );
    }
  });
};
