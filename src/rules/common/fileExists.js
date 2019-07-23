//
// Make sure the files exist in the repo.
//

import fs from 'fs';

import getMessageLogger from '../getMessageLogger';

const defaultMessage = filename =>
  `The file \`${filename}\` is required but it was not found. Please, commit it.`;

export default (files, { logType, buildMessage } = {}) => {
  if (!files) {
    warn('`commonFileExists`: missing "files" parameter.');
  } else {
    let fileList;
    if (typeof files === 'string') {
      fileList = [files];
    } else if (Array.isArray(files)) {
      fileList = files;
    }

    if (!fileList) {
      warn(
        '`commonFileExists`: invalid "files" parameter (string or array expected)',
      );
    } else {
      const log = getMessageLogger(logType);
      const messageBuilder = buildMessage || defaultMessage;
      fileList.forEach(filename => {
        if (!fs.existsSync(filename)) {
          log(messageBuilder(filename));
        }
      });
    }
  }
};
