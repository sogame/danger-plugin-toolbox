//
// List file lines containing warnings (like "warning" or "warning:").
//

import fs from 'fs';

import { stringArrayToList } from '../../utils';
import getMessageLogger from '../getMessageLogger';

export default (
  file,
  { ignoreNonExistingFile = false, ignoreRegex, logType, msg } = {},
) => {
  if (!file) {
    warn('`commonFileWarnings`: missing "file" parameter');
  } else if (!fs.existsSync(file)) {
    if (ignoreNonExistingFile !== true) {
      warn(`\`commonFileWarnings\`: file \`${file}\` does not exist`);
    }
  } else {
    const contents = fs.readFileSync(file).toString();
    let warnings = contents.match(/^.*\bwarning( |:).*$/gim);
    if (ignoreRegex) {
      warnings = warnings.filter((warning) => !warning.match(ignoreRegex));
    }
    if (warnings && warnings.length) {
      const log = getMessageLogger(logType);
      const warningsStr = stringArrayToList(warnings, true);
      const introMsg =
        msg || `The file \`${file}\` contains the following warnings:`;
      log(`${introMsg}<br>${warningsStr}`);
    }
  }
};
