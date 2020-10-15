//
// Recommend using Backpack's sub-components (like BpkButtonPrimary instead of BpkButton) in React components.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

const fileUsesBpButton = (filename) =>
  fileAddedLineMatch(filename, /<BpkButton[\s>]/i);

export default async ({ logType } = {}) => {
  const log = getMessageLogger(logType);
  const jsxFiles = committedFilesGrep(/\.jsx$/i);
  jsxFiles.forEach(async (filename) => {
    const usesBpkButton = await fileUsesBpButton(filename);
    if (usesBpkButton) {
      log(
        `The file \`${filename}\` seems to be using \`BpkButton\`, but it is recommended to use the sub-components (like \`BpkButtonPrimary\`, \`BpkButtonSecondary\`).`,
      );
    }
  });
};
