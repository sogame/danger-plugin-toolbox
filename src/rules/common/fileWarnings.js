//
// List file lines containing the word "warning".
//

import fs from 'fs';

import getMessageLogger from '../getMessageLogger';

export default (file, { logType, msg } = {}) => {
  if (!file) {
    warn('`commonFileWarnings`: missing "file" parameter');
  } else {
    const contents = fs.readFileSync(file).toString();
    const warnings = contents.match(/^.*\bwarning\b.*$/gim);
    if (warnings) {
      const log = getMessageLogger(logType);
      const warningsStr = warnings.map(line => `- ${line}`).join('\n');
      const introMsg =
        msg || `The file \`${file}\` contains the following warnings:`;
      log(`${introMsg}\n${warningsStr}`);
    }
  }
};
