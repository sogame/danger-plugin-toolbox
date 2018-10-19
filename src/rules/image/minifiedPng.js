//
// When uploading a PNG, make sure it's minified.
//

import getMessageLogger from '../getMessageLogger';
import { inCommitGrep } from '../helpers';

export default ({ logType } = {}) => {
  const changedPng = inCommitGrep(/.+\.png$/i);

  if (changedPng) {
    const log = getMessageLogger(logType);
    log(
      'Please, make sure that all PNG files are minified. Any online tool can be used, like for example [TinyPNG](https://tinypng.com/).',
    );
  }
};
