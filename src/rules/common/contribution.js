//
// Thank the author of external contributions.
//

import { getPositiveMessageLogger } from '../getMessageLogger';
import { externalPr, prAuthor } from '../helpers';

export default ({ msg, logType } = {}) => {
  if (externalPr) {
    const log = getPositiveMessageLogger(logType);
    const thanksMsg = msg || `Thanks for the contribution, ${prAuthor}!`;
    log(thanksMsg);
  }
};
