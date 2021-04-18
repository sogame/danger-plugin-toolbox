//
// Recommend using Backpack variables/spacings (or whole multiples of them) instead of creating new values.
//

import getMessageLogger from '../getMessageLogger';
import { fileAddedLineMatch, committedFilesGrep } from '../helpers';
import inlineLogMatching from '../inlineLogMatching';

const msgNonBackpackUnits =
  'It seems like non-[Backpack](https://backpack.github.io/) units (`rem`, `em`, `px`) are being used. [Backpack units](https://backpack.github.io/tokens/) (or whole multiples of them, like `3 * $bpk-spacing-xs`) should be used instead.';
const msgOnePixelRem =
  'It seems like `$bpk-one-pixel-rem` is being used. This can hide the usage of `px` instead of [Backpack](https://backpack.github.io/) units. Make sure using `px` is strictly needed.';

const regexNonBackpackaUnits = /[0-9](rem|em|px)[; ]/;
const regexOnePixelRem = /\$bpk-one-pixel-rem/;

const usesNonBackpackUnits = (filename) =>
  fileAddedLineMatch(filename, regexNonBackpackaUnits);

const usesOnePixelRem = (filename) =>
  fileAddedLineMatch(filename, regexOnePixelRem);

const checkVariables = async (filename, inline, logUnits, logPixel) => {
  if (inline === true) {
    inlineLogMatching(
      filename,
      regexNonBackpackaUnits,
      msgNonBackpackUnits,
      logUnits,
    );

    inlineLogMatching(filename, regexOnePixelRem, msgOnePixelRem, logPixel);
  } else {
    const [usesNonBackpack, usesPixelRem] = await Promise.all([
      usesNonBackpackUnits(filename),
      usesOnePixelRem(filename),
    ]);

    if (usesNonBackpack) {
      logUnits(
        `The file \`${filename}\` seems to be using non-[Backpack](https://backpack.github.io/) units (\`rem\`, \`em\`, \`px\`). [Backpack units](https://backpack.github.io/tokens/) (or whole multiples of them, like \`3 * $bpk-spacing-xs\`) should be used instead.`,
      );
    }

    if (usesPixelRem) {
      logPixel(
        `The file \`${filename}\` seems to be using \`$bpk-one-pixel-rem\`. This can hide the usage of \`px\` instead of [Backpack](https://backpack.github.io/) units. Make sure using \`px\` is strictly needed.`,
      );
    }
  }
};

export default async ({
  logTypeNonBackpackUnits,
  logTypeOnePixelRem,
  logType,
  inline,
} = {}) => {
  const logUnits = getMessageLogger(logTypeNonBackpackUnits || logType);
  const logPixel = getMessageLogger(logTypeOnePixelRem || logType);
  const cssFiles = committedFilesGrep(/\.scss$/i);
  await Promise.all(
    cssFiles.map((filename) =>
      checkVariables(filename, inline, logUnits, logPixel),
    ),
  );
};
