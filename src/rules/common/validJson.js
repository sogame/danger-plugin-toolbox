//
// Check JSON files are valid.
//

import fs from 'fs';

import getMessageLogger from '../getMessageLogger';
import { committedFilesGrep } from '../helpers';

export default ({ logType } = {}) => {
  const log = getMessageLogger(logType);
  const jsonFiles = committedFilesGrep(/\.json$/i);
  jsonFiles.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath).toString();
    let isValid;
    let exceptionMessage;
    try {
      const json = JSON.parse(fileContent);
      isValid = json && typeof json === 'object';
    } catch (e) {
      isValid = false;
      exceptionMessage = e.toString();
    }

    if (!isValid) {
      log(`\`${filePath}\` is not a valid JSON file: \`${exceptionMessage}\`.`);
    }
  });
};
