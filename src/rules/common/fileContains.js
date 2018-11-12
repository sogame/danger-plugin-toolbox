//
// Make sure file contents match a regex.
//

import fs from 'fs';

import getMessageLogger from '../getMessageLogger';
import { inCommit } from '../helpers';

const defaultMessage = (file, regex, reverse) =>
  reverse
    ? `The file \`${file}\` does not match \`${regex}\`.`
    : `The file \`${file}\` matches \`${regex}\`.`;

export default (
  file,
  regex,
  { buildMessage, reverse = false, logType } = {},
) => {
  if (!file) {
    warn('`commonFileContains`: missing "file" parameter');
  } else if (!regex) {
    warn('`commonFileContains`: missing "regex" parameter');
  } else if (inCommit(file)) {
    const fileContent = fs.readFileSync(file).toString();
    const matches = fileContent.match(regex);
    const matchRegular = !reverse && !matches;
    const matchReverse = reverse && matches;
    if (matchRegular || matchReverse) {
      const log = getMessageLogger(logType);
      const messageBuilder = buildMessage || defaultMessage;
      log(messageBuilder(file, regex, reverse));
    }
  }
};
