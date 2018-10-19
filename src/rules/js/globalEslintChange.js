//
// Check if global eslint configuration (".eslintrc") or ".eslintignore" have been modified.
//

import getMessageLogger from '../getMessageLogger';
import { inCommitGrep, inCommit } from '../helpers';

export default ({ path = '', logTypeEslintrc, logTypeEslintignore } = {}) => {
  const eslintrcFilename = `${path}.eslintrc`;
  const eslintignoreFilename = `${path}.eslintignore`;
  const eslintrcRegex = new RegExp(`^${eslintrcFilename}(.w+)?`);
  const changedEslintrc = inCommitGrep(eslintrcRegex);
  const changedEslintignore = inCommit(eslintignoreFilename);

  if (changedEslintrc) {
    const logEslintrc = getMessageLogger(logTypeEslintrc);
    logEslintrc(
      `\`${eslintrcFilename}\` has been modified. Make sure this change is needed globally and not locally.`,
    );
  }

  if (changedEslintignore) {
    const logEslintignore = getMessageLogger(logTypeEslintignore);
    logEslintignore(`\`${eslintignoreFilename}\` has been modified.`);
  }
};
