//
// Thank the author of external contributions.
//

import { externalPr, prAuthor } from '../helpers';

export default ({ msg } = {}) => {
  if (externalPr) {
    const thanksMsg = msg || `Thanks for the contribution, ${prAuthor}!`;
    message(thanksMsg);
  }
};
