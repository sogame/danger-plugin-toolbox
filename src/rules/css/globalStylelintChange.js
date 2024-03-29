//
// Check if global stylelint configuration (".stylelintrc") or ".stylelintignore" have been modified.
//

import getMessageLogger from '../getMessageLogger';
import { inCommitGrep, inCommit } from '../helpers';

export default ({
  logType,
  logTypeStylelintignore,
  logTypeStylelintrc,
  path = '',
} = {}) => {
  const stylelintrcFilename = `${path}.stylelintrc`;
  const stylelintignoreFilename = `${path}.stylelintignore`;
  const stylelintrcRegex = new RegExp(`^${stylelintrcFilename}(.w+)?`);
  const changedStylelintrc = inCommitGrep(stylelintrcRegex);
  const changedStylelintignore = inCommit(stylelintignoreFilename);

  if (changedStylelintrc) {
    const logStylelintrc = getMessageLogger(logTypeStylelintrc || logType);
    logStylelintrc(
      `\`${stylelintrcFilename}\` has been modified. Make sure this change is needed globally and not locally.`,
    );
  }

  if (changedStylelintignore) {
    const logStylelintignore = getMessageLogger(
      logTypeStylelintignore || logType,
    );
    logStylelintignore(`\`${stylelintignoreFilename}\` has been modified.`);
  }
};
