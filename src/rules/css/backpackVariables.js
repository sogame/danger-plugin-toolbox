//
// Recommend using Backpack variables/spacings (or whole multiples of them) instead of creating new values.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({ logType } = {}) => {
  const usesNonBackpackUnits = filename =>
    fileAddedLineMatch(filename, /[0-9](rem|em|px)[; ]/);

  const log = getMessageLogger(logType);
  const cssFiles = committedFilesGrep(/\.scss$/i);
  await cssFiles.forEach(async filename => {
    const usesNonBackpack = await usesNonBackpackUnits(filename);
    if (usesNonBackpack) {
      log(
        `The file \`${filename}\` seems to be using non-[Backapack](https://backpack.github.io/) units (\`rem\`, \`em\`, \`px\`). [Backpack units](https://backpack.github.io/tokens/) (or whole multiples of them, like \`3 * $bpk-spacing-xs\`) should be used instead.`,
      );
    }
  });
};
