//
// Check if global eslint configuration (".eslintrc") or ".eslintignore" have been modified.
//

import getMessageLogger from '../getMessageLogger';
import { inCommitGrep, inCommit } from '../helpers';

export default ({
  logType,
  logTypeEslintignore,
  logTypeEslintrc,
  path = '',
} = {}) => {
  const eslintrcFilename = `${path}.eslintrc`;
  const eslintignoreFilename = `${path}.eslintignore`;
  const eslintrcRegex = new RegExp(`^${eslintrcFilename}(.w+)?`);
  const changedEslintrc = inCommitGrep(eslintrcRegex);
  const changedEslintignore = inCommit(eslintignoreFilename);

  if (changedEslintrc) {
    const logEslintrc = getMessageLogger(logTypeEslintrc || logType);
    logEslintrc(
      `\`${eslintrcFilename}\` has been modified. Make sure this change is needed globally and not locally.`,
    );
  }

  if (changedEslintignore) {
    const logEslintignore = getMessageLogger(logTypeEslintignore || logType);
    logEslintignore(`\`${eslintignoreFilename}\` has been modified.`);
  }
};
