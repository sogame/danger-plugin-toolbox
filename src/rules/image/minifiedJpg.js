//
// When uploading a JPG, make sure it's minified.
//

import getMessageLogger from '../getMessageLogger';
import { inCommitGrep } from '../helpers';

export default ({ logType } = {}) => {
  const changedJpg = inCommitGrep(/.+\.jpe?g$/i);

  if (changedJpg) {
    const log = getMessageLogger(logType);
    log(
      'Please, make sure that all JPG files are minified. Any online tool can be used, like for example [TinyPNG](https://tinypng.com/).',
    );
  }
};
