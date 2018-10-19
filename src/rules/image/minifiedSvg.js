//
// When uploading an SVG, make sure it's minified.
//

import getMessageLogger from '../getMessageLogger';
import { inCommitGrep } from '../helpers';

export default ({ logType } = {}) => {
  const changedSvg = inCommitGrep(/.+\.svg$/i);

  if (changedSvg) {
    const log = getMessageLogger(logType);
    log(
      'Please, make sure that all SVG files are minified. Any online tool can be used, like for example [SVGOMG](https://jakearchibald.github.io/svgomg/).',
    );
  }
};
