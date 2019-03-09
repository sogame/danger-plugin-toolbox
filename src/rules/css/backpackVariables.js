//
// Recommend using Backpack variables/spacings (or whole multiples of them) instead of creating new values.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';

export default async ({
  logTypeNonBackpackUnits,
  logTypeOnePixelRem,
  logType,
} = {}) => {
  const usesNonBackpackUnits = filename =>
    fileAddedLineMatch(filename, /[0-9](rem|em|px)[; ]/);

  const usesOnePixelRem = filename =>
    fileAddedLineMatch(filename, /\$bpk-one-pixel-rem/);

  const logUnits = getMessageLogger(logTypeNonBackpackUnits || logType);
  const logPixel = getMessageLogger(logTypeOnePixelRem || logType);
  const cssFiles = committedFilesGrep(/\.scss$/i);
  await cssFiles.forEach(async filename => {
    const [usesNonBackpack, usesPixelRem] = await Promise.all([
      usesNonBackpackUnits(filename),
      usesOnePixelRem(filename),
    ]);

    if (usesNonBackpack) {
      logUnits(
        `The file \`${filename}\` seems to be using non-[Backapack](https://backpack.github.io/) units (\`rem\`, \`em\`, \`px\`). [Backpack units](https://backpack.github.io/tokens/) (or whole multiples of them, like \`3 * $bpk-spacing-xs\`) should be used instead.`,
      );
    }

    if (usesPixelRem) {
      logPixel(
        `The file \`${filename}\` seems to be using \`$bpk-one-pixel-rem\`. This can hide the usage of \`px\` instead of [Backapack](https://backpack.github.io/) units. Make sure using \`px\` is strictly needed.`,
      );
    }
  });
};
